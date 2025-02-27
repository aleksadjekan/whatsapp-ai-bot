const express = require("express");
const jwt = require("jsonwebtoken");
const qrcode = require("qrcode");
const app = express();
const qrcode_terminal = require("qrcode-terminal");
const { Client } = require("./whatsapp-web");

const client = new Client();

var qr_token = "";
const changeQRToken = (val) => {
  qr_token = val;
};

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("qr", (value) => {
  changeQRToken(value);
  qrcode_terminal.generate(value, { small: true });
});

client.on("message_create", (message) => {
  console.log(message.body);
});

// Start your client
client.initialize();

app.get("/qr_code", (req, res) => {
  qrcode.toDataURL(qr_token, (err, url) => {
    if (err) res.sendStatus(500);
    else res.json({ qrCode: url });
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(3000, (err) => {
  if (err) {
    console.log("Something went wrong", err);
  }
  console.log("Server is listening on port 3000");
});
