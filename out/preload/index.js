"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
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
const api = {
  getVersion() {
    return process.env.npm_package_version;
  },
  getGlobalConfig: () => {
    const globalConfig = electron.ipcRenderer.sendSync(channels.GET_GLOBAL_CONFIG);
    return globalConfig;
  },
  openDirectory(options) {
    return electron.ipcRenderer.invoke(channels.OPEN_DIRECTORY, options);
  }
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}
