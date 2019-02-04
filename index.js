const { app, BrowserWindow } = require('electron');


function createWindow () {
  // Создаем окно браузера.
  win = new BrowserWindow({ 
		webPreferences: {
			nodeIntegration: true
		}
  });

  // и загрузит index.html приложение.
  win.loadFile('index.html');
}

app.on('ready', createWindow);
app.on('window-all-closed', function() {
    app.quit();
});
