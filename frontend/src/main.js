const { app, BrowserWindow } = require("electron");
app.disableHardwareAcceleration();

const path = require("path");

// const host = "http://localhost";
// const port = "8080";

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadFile("index.html");
  //   win.loadURL(`${host}:${port}/index.html`);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
