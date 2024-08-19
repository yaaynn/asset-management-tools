"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const os = require("node:os");
const path$1 = require("node:path");
const fs = require("node:fs");
const yaml = require("yaml");
const express = require("express");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const os__namespace = /* @__PURE__ */ _interopNamespaceDefault(os);
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path$1);
const fs__namespace = /* @__PURE__ */ _interopNamespaceDefault(fs);
const icon = path.join(__dirname, "../../resources/icon.png");
const service = express();
const channels = {
  GET_GLOBAL_CONFIG: "GET_GLOBAL_CONFIG",
  SET_GLOBAL_CONFIG: "SET_GLOBAL_CONFIG",
  GET_MODE_CONFIG: "GET_MODE_CONFIG",
  SET_MODE_CONFIG: "SET_MODE_CONFIG",
  GET_MODE_CONFIG_LIST: "GET_MODE_CONFIG_LIST",
  SET_MODE_CONFIG_LIST: "SET_MODE_CONFIG_LIST",
  GET_MODE_CONFIG_LIST_BY_MODE: "GET_MODE_CONFIG_LIST_BY_MODE",
  OPEN_DIRECTORY: "OPEN_DIRECTORY",
  GET_FILE_LIST: "GET_FILE_LIST",
  GET_FILE_CONTENT: "GET_FILE_CONTENT",
  SET_FILE_CONTENT: "SET_FILE_CONTENT",
  GET_FILE_CONTENT_BY_PATH: "GET_FILE_CONTENT_BY_PATH",
  SET_FILE_CONTENT_BY_PATH: "SET_FILE_CONTENT_BY_PATH",
  GET_FILE_CONTENT_BY_PATH_LIST: "GET_FILE_CONTENT_BY_PATH_LIST"
};
const configDirectory = path__namespace.join(os__namespace.homedir(), ".config", "asset-management-tools");
const globalConfigPath = path__namespace.join(configDirectory, "global.yml");
exports.globalConfig = void 0;
function readConfig() {
  if (!fs__namespace.existsSync(configDirectory)) {
    fs__namespace.mkdirSync(configDirectory, { recursive: true });
  }
  if (!fs__namespace.existsSync(globalConfigPath)) {
    return void 0;
  }
  try {
    const fileContents = fs__namespace.readFileSync(globalConfigPath, "utf8");
    return yaml.parse(fileContents);
  } catch (err) {
    console.error(`Error reading YAML file: ${err}`);
    return void 0;
  }
}
function writeConfig(config) {
  if (!fs__namespace.existsSync(configDirectory)) {
    fs__namespace.mkdirSync(configDirectory, { recursive: true });
  }
  try {
    const fileContents = yaml.stringify(config);
    fs__namespace.writeFileSync(globalConfigPath, fileContents, "utf8");
  } catch (err) {
    console.error(`Error writing YAML file: ${err}`);
  }
}
function initialGlobalConfig() {
  const config = {
    hostPath: "",
    workingMode: false,
    protocol: "http",
    hostname: "localhost",
    port: 12170
  };
  writeConfig(config);
  return config;
}
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 1366,
    height: 768,
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  initOn(mainWindow);
  mainWindow.on("ready-to-show", () => {
    mainWindow.maximize();
    mainWindow.show();
    mainWindow.setMenu(null);
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
  if (!electron.app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}
electron.app.whenReady().then(() => {
  exports.globalConfig = readConfig();
  if (!exports.globalConfig) {
    exports.globalConfig = initialGlobalConfig();
  }
  if (exports.globalConfig.workingMode === "local") {
    service.listen(exports.globalConfig.port, exports.globalConfig.hostname, () => {
      console.log(`Server is running at http://${exports.globalConfig?.hostname}:${exports.globalConfig?.port}/`);
    });
  }
  utils.electronApp.setAppUserModelId("com.idatac.asset-management-tools");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  electron.ipcMain.on("ping", () => console.log("pong"));
  const noGui = process.argv.includes("--no-gui");
  if (!noGui) {
    createWindow();
  }
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
function initOn(win) {
  electron.ipcMain.on(channels.GET_GLOBAL_CONFIG, (event) => {
    event.returnValue = exports.globalConfig;
  });
  electron.ipcMain.handle(channels.OPEN_DIRECTORY, async (_, options) => {
    return electron.dialog.showOpenDialog(win, options);
  });
}
exports.configDirectory = configDirectory;
exports.globalConfigPath = globalConfigPath;
