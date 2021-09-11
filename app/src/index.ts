import { app, BrowserWindow, dialog, ipcMain} from 'electron';
const isDevelopment = process.env.NODE_ENV !== 'production';

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

try {
  require('electron-reloader')(module);
} catch (_) {
  console.log('fail');
}

const createWindow = (): void => {
  // Create the browser window.

  const mainWindow = new BrowserWindow({
    height: 828,
    width: 800,
    minHeight:828,
    minWidth:800,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    darkTheme: true,
    icon: 'C:/Users/Timber/Desktop/Programming/Electron_Tests/my-new-app/src/icons/webdl.ico',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if(isDevelopment) mainWindow.webContents.openDevTools();

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['']
      }
    });
  });

  mainWindow.webContents.session.loadExtension("C:/Users/Timber/Desktop/Programming/GitHub_repos/WebDL/app/react-devtools").catch(console.error)

  ipcMain.on('select-dirs', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    });
    mainWindow.webContents.send('select-dirs-result', result.filePaths);
  });

  ipcMain.on('maximize', () => {
    mainWindow.isMaximized() ? mainWindow.restore() : mainWindow.maximize();
  });
  ipcMain.on('minimize', () => {
    mainWindow.minimize();
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
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
