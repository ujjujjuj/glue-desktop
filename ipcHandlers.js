const { ipcMain, dialog } = require("electron");
const { clipboard } = require("electron");
const { client } = require("./protoclient/routes");
const { start } = require("./protoclient/app");
let mainwin;

ipcMain.handle("ping", () => {
  console.log("ping");
});

ipcMain.handle("setAuth", (e, token) => {
  client.token = token;
  start();
});

ipcMain.handle("reload", () => {
  mainwin.webContents.reloadIgnoringCache();
});

ipcMain.handle("sendFile", async (e, otherId) => {
  const dialogRes = await dialog.showOpenDialog({ properties: ["openFile"] });
  if (!dialogRes.canceled) {
    filePath = dialogRes.filePaths[0];
    client.sendFile(filePath, otherId);
    console.log(otherId, filePath);
  }
});
(async () => {
  const clipboardy = (await import("clipboardy")).default;
  let previousText = clipboardy.readSync();
  setInterval(() => {
    const currentText = clipboardy.readSync();
    if (previousText !== currentText) {
      console.log(currentText);
      previousText = currentText;
      client.sendText(currentText);
    }
  }, 200);
})();

module.exports.setwin = (_mainwin) => (mainwin = _mainwin);
