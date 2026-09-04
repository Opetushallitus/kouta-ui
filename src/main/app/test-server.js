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
// mutta se tuottaa 1024-bittisen ja sha1-allekirjoitetun sertifikaatin, jonka OpenSSL 3.5+
// hylkää oletusturvatasollaan (SECLEVEL 2) virheellä ERR_SSL_EE_KEY_TOO_SMALL. Tämä ei näy
// CI:ssä, koska virallinen Node-jakelu niputtaa mukaansa OpenSSL 3.0:n, mutta esim.
// Homebrew'n node@22 linkittyy jaettuun uudempaan OpenSSL:ään, jolloin testipalvelin ei
// käynnisty lainkaan paikallisesti.
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
