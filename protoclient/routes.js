const TCPClient = require("./TCPClient");
const fs = require("fs");

const client = new TCPClient("192.168.161.25", 31337);
let clipboardy = null;
import("clipboardy").then((mod) => (clipboardy = mod.default));
const downloadsFolder = require("downloads-folder");
const path = require("path");

client.get("PONG", (dat) => {
  const hrTime = process.hrtime();
  const ns = hrTime[0] * 1000 + hrTime[1] / 1000000;
  console.log(`Ping: ${(ns - dat.ns).toLocaleString()}ms`);
});

client.get("AUTH_OK", (data) => {
  client.state.auth = true;
  client.state.id = data.id;
  client.discover();
});

client.get("CLIP_TEXT", (dat) => {
  // copy text to the clipboard
  console.log(dat);
  clipboardy.writeSync(dat.text);
});

client.get("CLIP_FILE", (dat) => {
  fs.writeFileSync(path.join(downloadsFolder(), at.fileName), dat.file);
  client.send({ type: "CLIP_FILE_ENDED", text: "File Transfer Completed" });
});

client.get("CLIP_FILE_ENDED", (dat) => {
  console.log(dat);
});

client.get("DISCOVER", (dat) => {
  console.log(dat);
});

module.exports = { client };
