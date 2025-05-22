const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
// const electronReload = require('electron-reload');
const { ipcMain } = require('electron');


// // electron-reload | SOLO DESARROLLO!!!!!!!!!!!!!!!!!!!!!!!!!!

// if (process.env.NODE_ENV !== 'production') {
//     require('electron-reload')(__dirname, {
//       electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
//       hardResetMethod: 'exit',
//     });
//   }
// electron-reload
  
  
function createWindow() {



/*----------------------------------------------*
*                                               *
*          CONFIGURACIONES GLOBALES             *
*                                               *
*-----------------------------------------------*/
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    icon: path.join(__dirname, './icons/ico.png'),
    webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false
    },
    frame: false //BARRA | FILE | EDIT | VIEW | HELP
  });

  mainWindow.on('show', () => {
    mainWindow.focus();
  });
  

  mainWindow.loadFile('index.html');


//minimize maximise window
ipcMain.on('minimize', () => {
    mainWindow.minimize();
  });
  
  ipcMain.on('close', () => {
    mainWindow.close();
  });
//minimize maximise window
  
mainWindow.setMinimumSize(1111, 500);
}
/*----------------------------------------------------------*/
app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
