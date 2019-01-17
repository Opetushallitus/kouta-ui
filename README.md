# Kouta-UI

Uuden koulutustarjonnan käyttöliittymä.

Kouta-UI on luotu create-react-app:lla. Backend, jonka ainoa tehtävä on jakaa käyttöliittymä, on Spring Boot 2.0 -sovellus.

[![Build status](https://travis-ci.org/Opetushallitus/kouta-ui.svg?branch=master)](https://travis-ci.org/Opetushallitus/kouta-ui)

## Vaatimukset

Lokaalia ajoa varten Kouta-backendin pitää vastata osoitteessa:

http://localhost:8099

## Käyttöliittymän kehittäminen

Kehityksen aikana käyttöliittymää kannattaa ajaa pelkästään nodella, jolloin muutokset näkyvät suoraan selaimessa.

`cd src/main/app`

`npm start`

Käyttöliittymä aukeaa osoitteeseen:

http://localhost:3000/

Portteja voi vaihtaa ajamalla:

`PORT=5555 BACKEND_PORT=5556 npm start`

## Buildaus ja käynnistys

Projektin saa buildattua komennolla:

`mvn clean install`

Tämän jälkeen projektin voi käynnistää lokaalisti komennolla:

`java -jar target/kouta-ui-0.1.0-SNAPSHOT.jar --spring.config.location=./koutaui-dev.yml`

tai komennolla:

`mvn spring-boot:run`

Sovellus aukeaa osoitteeseen:

http://localhost:8080/

## Testit

Testit löytyvät hakemistosta `src/main/app/src/__tests__`.
Nimetään yksikkötestit päätteellä `.test.js` ja laitetaan ne sopiviin hakemistoihin.
Lisäksi projektissa on headless-selaintestejä, jotka käyttävät Puppeteer-kirjastoa. Laitetaan ne hakemistoon
`src/main/app/src/__tests__/headless/`. Mock-datan luontiin tarvittavat javascript-luokat ja muut testityökalut
voi laittaa hakemistoon `src/main/app/src/__tests__/mocks`, joka skipataan testejä ajettaessa.

Testit voi ajaa default porteissa komennolla

`npm test`

tai tietyissä porteissa

`PORT=5555 BACKEND_PORT=5556 npm test`

## Storybook

[Storybookin](https://github.com/storybooks/storybook) voi käynnistää komennolla `npm run storybook`. Käynnistymisen jälkeen Storybook löytyy osoitteesta [http://localhost:9009](http://localhost:9009).
