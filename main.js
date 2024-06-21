// main.js

const { app, BrowserWindow, ipcMain } = require('electron');
const usb = require('usb');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  mainWindow.loadFile('index.html');

  // Abrir las herramientas de desarrollo (opcional)
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  usb.on('attach', function(device) {
    console.log('Dispositivo USB conectado:');
    console.log(device);

    // Enviar información del dispositivo a la interfaz de usuario
    mainWindow.webContents.send('usb-device-connected', {
      vendorId: device.deviceDescriptor.idVendor,
      productId: device.deviceDescriptor.idProduct
    });
  });

  usb.on('detach', function(device) {
    console.log('Dispositivo USB desconectado:');
    console.log(device);

    // Enviar información del dispositivo a la interfaz de usuario
    mainWindow.webContents.send('usb-device-disconnected', {
      vendorId: device.deviceDescriptor.idVendor,
      productId: device.deviceDescriptor.idProduct
    });
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
