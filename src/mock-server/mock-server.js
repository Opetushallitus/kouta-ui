const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

app.use('/app', express.static('public'))
app.use('/app', express.static(path.join(__dirname, 'public')))

const endpoints = {
  '/koodisto-service/rest/json/koulutus/koodi': 'koulutus-koodi',
  '/koodisto-service/rest/json/relaatio/sisaltyy-alakoodit/:koodiUri' : 'relaatio-sisaltyy-alakoodit'
};

const loadData = (name) => JSON.parse(fs.readFileSync(`data/${name}.json`, 'utf8'));

const addEndpoint = (endpointUrl) => app.get(endpointUrl, (req,res) => res.json(loadData(endpoints[endpointUrl])));

Object.keys(endpoints).forEach(addEndpoint);

module.exports = app;
app.listen(3001);

