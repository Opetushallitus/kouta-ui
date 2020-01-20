# Kouta-UI

Uuden koulutustarjonnan käyttöliittymä.

Kouta-UI on luotu create-react-app:lla. Backend, jonka ainoa tehtävä on jakaa käyttöliittymä, on Spring Boot 2.0 -sovellus.

[![Build status](https://travis-ci.org/Opetushallitus/kouta-ui.svg?branch=master)](https://travis-ci.org/Opetushallitus/kouta-ui)

## Vaatimukset

Lokaalia ajoa varten Kouta-backendin pitää vastata osoitteessa:

http://localhost:8099

Jos projektia halutaan ajaa pilviympäristöä vasten, tiedostoon `koutaui-dev.yml` pitää vaihtaa `host-virkailija` 
osoittamaan oikeaan ympäristöön. Lisäksi CORSin pystyy kiertämään käynnistämällä Chrome (macissa) komennolla:

`open -a Google\ Chrome --args --disable-web-security --user-data-dir=/tmp/moi`

Kannattaa halutessaan laittaa user-data-dir osoittamaan sopivampaan paikkaan. Jos se on /tmp-hakemistossa, 
esim. selaimen laajennokset häviävät.

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

Yksikkötestit löytyvät testattavan moduulin `*.test.jsx?` (esim. `components/Input/Input.test.jsx`) tiedostosta, tai sen `__tests__` kansiosta. Integraatiotestit löytyvät `cypress/integration` kansiosta.

Yksikkötestit voi ajaa komennolla `npm test` ja integraatiotestit komennolla `npm run test:e2e`. Kaikki testit pystyy ajamaan komennolla `npm run test:ci`.

### Cypress TestRunner, interaktiivisesti

On hauska katsoa ja korjata cypress testia interaktiivisti Cypress TestRunnerilla: 

    cd src/main/app
    npm start
    
Ja sitten samassa kansiossa, mutta toisessa shellissa: 

    npx cypress open

## Storybook

[Storybookin](https://github.com/storybooks/storybook) voi käynnistää komennolla `npm run storybook`. Käynnistymisen jälkeen Storybook löytyy osoitteesta [http://localhost:9009](http://localhost:9009). Komponenttien mahdolliset storyt löytyvät komponentin oman kansion `*.stories.jsx` (esim. `components/Alert/Alert.stories.jsx`) tiedostosta. Hyödyllisiä story [dekoraattoreita](https://storybook.js.org/docs/addons/introduction/#1-decorators) (esim. lokalisaatio- ja api-dekoraattorit) löytyy `storybookUtils.js` tiedostosta.

## Lokalisaatio

Lokalisointiin käytetään [react-i18next](https://github.com/i18next/react-i18next) kirjastoa, joka puolestaa käyttää [i18next](https://www.i18next.com/) kirjastoa. React-komponenttien sisällä käytössä on [useTranslation](https://github.com/Opetushallitus/kouta-ui/blob/master/src/main/app/src/components/useTranslation/index.js)-hook. Käännökset haetaan lokalisaatio-service:ltä `kouta`-kategoriosta. Suomenkieliset käännökset on määritelty [translations/fi.js](https://github.com/Opetushallitus/kouta-ui/blob/master/src/main/app/src/translations/fi.js)-tiedostossa. Käännöksissä käytetään ensisijaisesti lokalisaatio-service:n tarjoamia käännöksiä. Uusien käännöksien lisäämisen kannattaa aloittaa lisäämällä suomenkielinen käännös `translations/fi.js`-tiedostoon.

