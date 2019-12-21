const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const util =  require('util');
const fs = require('fs');

const stat = util.promisify(fs.stat);
let mainWindow;

app.on('ready', () => {
  const html = path.join('src', 'index.html');

  mainWindow =  new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    width: 600,
    height: 600
  });

  mainWindow.loadFile(html);

  // mainWindow.webContents.openDevTools();

  ipcMain.on('files', async (event, filesData) => {
    try {
      const data =  await Promise.all(
        filesData.map(async ({name, pathName}) => ({
          ...await stat(pathName),
          name,
          pathName
        }))
      );

      mainWindow.webContents.send('metadata', data);
    } catch (error) {
      mainWindow.webContents.send('metadata:error', error);
    }
  })
});