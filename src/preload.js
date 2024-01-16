const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    databaseHandler: (data) => ipcRenderer.invoke('database-handler', data),
});