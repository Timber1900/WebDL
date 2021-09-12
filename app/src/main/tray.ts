import { BrowserWindow, ipcMain, Menu, Tray } from 'electron';

export const setUpMinMax = (mainWindow: BrowserWindow) => {
  ipcMain.on('maximize', () => {
    mainWindow.isMaximized() ? mainWindow.restore() : mainWindow.maximize();
  });
  ipcMain.on('minimize', () => {
    mainWindow.hide();
  });
  ipcMain.on('close', () => {
    mainWindow.close();
  });

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('maximize');
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('unmaximize');
  });
}
let tray = null;
export const setupTray = (mainWindow: BrowserWindow) => {
  tray = new Tray("C:/Users/Timber/Desktop/Programming/GitHub_repos/WebDL/app/src/renderer/icons/webdl.ico")

  const showApp = () => {
    mainWindow.show();
  }

  const closeApp = () => {
    mainWindow.close();
  }

  const contextMenu = Menu.buildFromTemplate([
    { label: 'WebDL', type: 'normal', click: showApp},
    { type: 'separator' },
    { label: 'Close App', type: 'normal', click: closeApp },
  ])
  tray.setToolTip('WebDL');
  tray.setTitle('WebDL')
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    mainWindow.show();
  })

  return tray;
}
