const https = require('https');
const path = require('path');

const express = require('express');
const pem = require('https-pem');

const app = express();
app.use('/kouta', express.static(path.join(__dirname, 'build')));

app.get(['/kouta', '/kouta/*'], function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const httpsServer = https.createServer(pem, app);
httpsServer.listen(3000);
