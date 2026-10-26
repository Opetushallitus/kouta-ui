const https = require('https');
const path = require('path');

const express = require('express');
const selfsigned = require('selfsigned');

const app = express();
app.use('/kouta/', express.static(path.join(__dirname, 'build')));

app.get(['/kouta/', '/kouta/*splat'], function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Generoidaan sertifikaatti ajon aikana. Aiemmin tähän käytettiin https-pem-pakettia,
// mutta sen 1024-bittinen avain kaatuu uudemmassa OpenSSL:ssä jo palvelinta luotaessa
// (https.createServer: ERR_SSL_EE_KEY_TOO_SMALL). Ratkaiseva on avaimen koko, ei
// allekirjoitusalgoritmi. Ei näy CI:ssä, jossa virallinen Node-jakelu niputtaa oman
// OpenSSL 3.0:nsa; osuu paikallisiin ympäristöihin, joiden node linkittyy jaettuun
// uudempaan OpenSSL:ään (esim. Homebrew'n node@22).
selfsigned
  .generate([{ name: 'commonName', value: 'localhost' }], {
    keySize: 2048,
    algorithm: 'sha256',
  })
  .then(pem => {
    const httpsServer = https.createServer(
      { key: pem.private, cert: pem.cert },
      app
    );
    httpsServer.listen(3000, () => {
      console.log(
        'Testipalvelin käynnissä osoitteessa https://localhost:3000/kouta/'
      );
    });
  })
  .catch(err => {
    console.error('Testipalvelimen käynnistys epäonnistui', err);
    process.exit(1);
  });
