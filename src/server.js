const path = require('path');
const fs = require('fs');
const express = require('express');
const https = require('https');

let app = express();
let server = app;
let port = process.env.PORT || 3000;

// TODO: process.env.LOCALHOST ??
// alternatively, !process.env.PRODUCTION && !process.env.STAGING
if (process.env.DEVELOPMENT) {
  let certOptions = {
    key: fs.readFileSync(path.join(__dirname, '../server.key')),
    cert: fs.readFileSync(path.join(__dirname, '../server.crt'))
  }
  server = https.createServer(certOptions, app);
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, '/styles.css'));
});

app.get('/client.js', (req, res) => {
  res.sendFile(path.join(__dirname, '/client.js'));
});

app.get('/service-worker.js', (req, res) => {
  res.sendFile(path.join(__dirname, '/service-worker.js'));
});

app.get('/serviceworker-cache-polyfill.js', (req, res) => {
  res.sendFile(path.join(__dirname, '/serviceworker-cache-polyfill.js'));
});

server.listen(port, () => {
  console.log(`listening on ${port}...`);
});