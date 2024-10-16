// const { Client, LocalAuth, Buttons, List } = require("whatsapp-web.js");
// const qrcode = require("qrcode-terminal");
// const { default: axios } = require("axios");
// const { WaitTask } = require("puppeteer");

// const client = new Client({
//   authStrategy: new LocalAuth(),
//   puppeteer: {
//     headless: true,
//     args: ["--no-sandbox", "--disable-gpu"],
//   },
//   webVersionCache: {
//     type: "remote",
//     remotePath:
//       "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
//   },
// });

// client.on("ready", () => {
//   console.log("Client is ready!");
// });

// client.on("qr", (qr) => {
//   qrcode.generate(qr, { small: true });
// });

// client.initialize();

const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const app = express();
const PORT = process.env.PORT || 3000;

// Variabel untuk menyimpan status client
let clientReady = false;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"],
  },
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  },
});

// Inisialisasi client dan handle event ready
client.on("ready", () => {
  console.log("Client is ready!");
  clientReady = true; // Set status siap ke true
});

// Endpoint untuk generate QR code
app.get("/api/generate-qr", (req, res) => {
  client.on("qr", (qr) => {
    // Menghasilkan QR code menjadi data URL
    qrcode.toDataURL(qr, (err, url) => {
      if (err) {
        return res.status(500).send("Error generating QR code");
      }
      res.send({ qrCode: url });
    });
  });

  // Cek jika client sudah siap
  if (clientReady) {
    return res.send({ message: "Client is already ready!" });
  }
});

// Inisialisasi client
client.initialize();

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
