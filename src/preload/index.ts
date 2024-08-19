import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { channels } from '../utils/channels'
import { GlobalConfig } from '../utils/interfaces'

export interface PreloadApi {
  getVersion: () => string
  getGlobalConfig: () => GlobalConfig
  writeGlobalConfig: (config: GlobalConfig) => Promise<string>
  openDirectory: (options: Electron.OpenDialogOptions) => Promise<Electron.OpenDialogReturnValue>
}

// Custom APIs for renderer
const api = {
  getVersion() {
    return process.env.npm_package_version
  },
  getGlobalConfig: (): GlobalConfig => {
    const globalConfig = ipcRenderer.sendSync(channels.GET_GLOBAL_CONFIG)
    return globalConfig
  },
  writeGlobalConfig(config: GlobalConfig): Promise<string> {
    return ipcRenderer.invoke(channels.WRITE_GLOBAL_CONFIG, config)
  },
  openDirectory(options: Electron.OpenDialogOptions): Promise<Electron.OpenDialogReturnValue> {
    return ipcRenderer.invoke(channels.OPEN_DIRECTORY, options)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
