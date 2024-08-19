import { app, BrowserWindow, dialog, ipcMain, OpenDialogOptions, shell } from 'electron'
import { join } from 'path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import * as os from 'node:os'
import * as path from 'node:path'
import * as fs from 'node:fs'
import yaml from 'yaml'
import service from '../built-in-service/service'
import { channels } from '../utils/channels'
import { GlobalConfig } from '../utils/interfaces'

export const configDirectory = path.join(os.homedir(), '.config', 'asset-management-tools')
export const globalConfigPath = path.join(configDirectory, 'global.yml')

export let globalConfig: GlobalConfig | undefined = void 0

function readConfig(): GlobalConfig | undefined {
  if (!fs.existsSync(configDirectory)) {
    fs.mkdirSync(configDirectory, { recursive: true })
  }

  if (!fs.existsSync(globalConfigPath)) {
    return void 0
  }
  try {
    const fileContents = fs.readFileSync(globalConfigPath, 'utf8')
    return yaml.parse(fileContents)
  } catch (err) {
    console.error(`Error reading YAML file: ${err}`)
    return void 0
  }
}

function writeConfig(config: GlobalConfig): void {
  if (!fs.existsSync(configDirectory)) {
    fs.mkdirSync(configDirectory, { recursive: true })
  }

  try {
    const fileContents = yaml.stringify(config)
    fs.writeFileSync(globalConfigPath, fileContents, 'utf8')
  } catch (err) {
    console.error(`Error writing YAML file: ${err}`)
  }
}

function initialGlobalConfig(): GlobalConfig {
  const config: GlobalConfig = {
    hostPath: '',
    workingMode: false,
    protocol: 'http',
    hostname: 'localhost',
    port: 12170
  }
  writeConfig(config)
  return config
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  initOn(mainWindow)

  mainWindow.on('ready-to-show', () => {
    mainWindow.maximize()
    mainWindow.show()
    mainWindow.setMenu(null)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools()
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  globalConfig = readConfig()
  if (!globalConfig) {
    globalConfig = initialGlobalConfig()
  }

  if (globalConfig.workingMode === 'local') {
    service.listen(globalConfig.port, globalConfig.hostname, () => {
      console.log(`Server is running at http://${globalConfig?.hostname}:${globalConfig?.port}/`)
    })
  }

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.idatac.asset-management-tools')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  const noGui = process.argv.includes('--no-gui')

  if (!noGui) {
    createWindow()
  }
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

function initOn(win: BrowserWindow): void {
  // region 操作全局配置文件
  ipcMain.on(channels.GET_GLOBAL_CONFIG, (event) => {
    event.returnValue = globalConfig
  })

  ipcMain.handle(channels.WRITE_GLOBAL_CONFIG, async (_, config: GlobalConfig) => {
    writeConfig(config)
    if (config.workingMode === 'local') {
      runService(config)
    }
  })
  // endregion

  ipcMain.handle(channels.OPEN_DIRECTORY, async (_, options: OpenDialogOptions) => {
    return dialog.showOpenDialog(win, options)
  })
}

function runService(config: GlobalConfig): string | undefined {
  service.listen(config.port, config.hostname, () => {
    console.log(`Server is running at http://${config?.hostname}:${config?.port}/`)
  })

  return void 0
}
