const https = require('https');
const path = require('path');

const express = require('express');
const pem = require('pem');

// Certificate properties
const certProps = {
  days: 1, // Validity in days
  selfSigned: true,
};

pem.createCertificate(certProps, (error, keys) => {
  if (error) {
    throw error;
  }
  const credentials = { key: keys.serviceKey, cert: keys.certificate };
  const app = express();
  app.use('/kouta', express.static(path.join(__dirname, 'build')));

  app.get(['/kouta', '/kouta/*'], function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(3000);
});
