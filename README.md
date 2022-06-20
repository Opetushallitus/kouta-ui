# Kouta-UI

Uuden koulutustarjonnan virkailijan käyttöliittymä.

Kouta-UI on luotu create-react-app:lla, ja se on kääritty Spring Boot 2.0 -sovellukseen, jonka ainoa tehtävä on jakaa käyttöliittymä.

[![Kouta-ui](https://github.com/Opetushallitus/kouta-ui/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/kouta-ui/actions/workflows/build.yml)

## Arkkitehtuuri ja kirjastot

### Lomakkeiden logiikka

Lomakkeiden tilan hallinta on toteutettu redux-form-kirjastolla. Redux-form *rekisteröi* kentän kun sitä vastaava komponentti renderöidään. Vastaavasti *rekisteröinti poistetaan* (unregister), kun kenttää vastaava komponentti poistetaan. Näiden redux-tapahtumien avulla tunnistetaan milloin käyttäjä on poistanut kentät itse näkyvistä ja niille halutaan lähettää tyhjä arvo. Tämä onnistuu, koska *unregister*-tapahtumaa ei lähetetä alussa kun kenttä on piilossa.

### Palvelinkyselyiden hallinta ja muistintaminen

Jotkin kyselyistä halutaan muistintaa pitkään (organisaatiopalvelu, eperusteet, koodisto jne.), ja joitakin vain hyvin lyhyen aikaa (kouta-backend). Haasteena on myös saman palvelimelta ladatun tiedon käyttäminen eri komponenteissa. Kouta-UI:ssa käytetään [react-query](https://react-query.tanstack.com/)-kirjastoa, joka tarjoaa miellyttävän abstraktion palvelinpyyntöjen hallintaan. Omien `useEffect`-rakennelmien tekeminen tai Reduxin käyttäminen tätä tarkoitusta varten ei ole tarpeen, eikä suotavaa.

## Käyttöliittymän kehittäminen

Kehityksen aikana käyttöliittymää kannattaa ajaa pelkästään nodella, jolloin muutokset näkyvät suoraan selaimessa.

`cd src/main/app`

`npm run start`

Hetken kuluttua käyttöliittymä on käytettävissä osoitteessa (selainta ei avata automaattisesti):

https://localhost:3000

**Huom! HTTPS-protokolla käytössä.** Webpack-dev-serverin proxy on konfiguroitu oletuksena ohjaamaan kaikki muut polut paitsi `/`, `/kouta` ja `/kouta/*` osoitteeseen `https://virkailija.hahtuvaopintopolku.fi`. Käytetään oletuksena self-signed-sertifikaatteja, eikä CORS-rajoituksia ei tarvitse kiertää selaimessa. Kehitysympäristön virkailija-osoitetta, johon proxytaan voi vaihtaa asettamalla ympäristömuuttujan `DEV_VIRKAILIJA_URL` eri arvoon (esim. `.env.local`-tiedostossa).

## Ajaminen lokaalisti kouta-backendin kanssa

Korvaa kouta-backendissä dev-vars.yml-tiedostoon: 

    cas_url: https://localhost:3000/cas
    kouta_backend_cas_service: https://localhost:3000/kouta-backend/auth/login
    
ja käynnistä kouta-backend (EmbeddedJettyLauncher).

Aseta kouta-ui:ssa ympäristömuuttuja (esim. `.env.local`-tiedostossa): 

`KOUTA_BACKEND_URL=http://localhost:8099`

Käynnistä kouta-ui lokaalisti komennolla: 

`npm run start`

Käynnistä Opintopolun VPN, jotta kouta-backend saa yhteyden käyttöoikeus-servicen `userDetails`-rajapintaan. 

## Ajaminen lokaalisti kouta-backendin kanssa testiympäristöä vasten

Käynnistä Opintopolun VPN

Käynnistä kouta-backend sen README:ssa olevan osion (3.4.1 Ajo testiympäristöä vasten) ohjeen mukaan.

Aseta kouta-ui:ssa ympäristömuuttuja (esim. `.env.local`-tiedostossa): 

`KOUTA_BACKEND_URL=http://localhost:8099

Käynnistä kouta-ui lokaalisti komennolla: 

`npm run start`

Kirjaudu selaimella linkistä http://localhost:8099/kouta-backend/auth/login

Tämän jälkeen mene selaimella osoitteeseen https://localhost:3000/kouta

## Buildaus ja käynnistys (Spring Boot -sovellus)

Projektin saa buildattua komennolla:

`mvn clean install`

Tämän jälkeen projektin voi käynnistää lokaalisti komennolla:

`java -jar target/kouta-ui-0.1.0-SNAPSHOT.jar --spring.config.location=./koutaui-dev.yml`

tai komennolla:

`mvn spring-boot:run`

Sovellus aukeaa osoitteeseen:

http://localhost:8080

Jos projektia halutaan ajaa pilviympäristöä vasten, tiedostoon `koutaui-dev.yml` pitää vaihtaa `host-virkailija` 
osoittamaan oikeaan ympäristöön. Lisäksi CORSin pystyy kiertämään käynnistämällä Chrome (macissa) komennolla:

`open -a Google\ Chrome --args --disable-web-security --user-data-dir=/tmp/moi`

## Testit

Yksikkötestit löytyvät testattavan moduulin `*.test.jsx?` (esim. `components/Input/Input.test.jsx`) tiedostosta. Integraatiotestit löytyvät `cypress/integration` kansiosta.

Yksikkötestit voi ajaa komennolla `npm test` ja integraatiotestit komennolla `npm run test:integration`. Kaikki testit pystyy ajamaan komennolla `npm run test:ci`.

### Integraatiotestien ajaminen interaktiivisesti (Cypress)

Cypress-testejä voi ajaa myös interaktiivisesti käynnistämällä ensin kouta-ui:n integraatio-moodissa:

    cd src/main/app
    npm run start:integration

ja sitten samassa kansiossa, mutta toisessa shellissä: 

    npm run cypress:open
    
Cypress-integraatiotestit olettavat, että sovellus on renderöity käyttäen käännösavaimia, minkä vuoksi on käytettävä `npm start:integration`tai `npm start:integration:debug` komentoa sovelluksen käynnistämiseen. Npm Skripti `start:integration:debug` eroaa `start:integration`:sta siten, että se sallii sovelluksen kyselyt ulkopuolelle. Tämä helpottaa mm. cypressin-testien api-mockien päivittämistä ja testaamista, kun taas normaalisti integraatiotesteissä halutaan estää yhteydet ulkopuolisiin rajapintoihin.

### API-kutsujen mockaaminen

KTO-projektissa on toteutettu omat työkalut API-kutsujen mockauksen helpottamiseen. Työkalut ja niiden dokumentaatio löytyvät [kto-ui-common](https://github.com/Opetushallitus/kto-ui-common)-reposta. `Update-mocks.js`-skriptille on tehty käytön helpottamiseksi npm skripti `update-mocks`, jota siis kutsutaan komennolla `npm run update-mocks`. Muista käynnistää lokaali kehitysproxy (`npm run start`) ennen mockien päivitystä, jotta mockeille tulee oikeaa dataa localhostin kautta.

## Storybook

[Storybookin](https://github.com/storybooks/storybook) voi käynnistää komennolla `npm run storybook`. Käynnistymisen jälkeen Storybook löytyy osoitteesta [http://localhost:9009](http://localhost:9009). Komponenttien mahdolliset storyt löytyvät komponentin oman kansion `*.stories.jsx` (esim. `components/Alert/Alert.stories.jsx`) tiedostosta. Hyödyllisiä story [dekoraattoreita](https://storybook.js.org/docs/addons/introduction/#1-decorators) (esim. lokalisaatio- ja api-dekoraattorit) löytyy `storybookUtils.js` tiedostosta.

## Lokalisaatio

Lokalisointiin käytetään [react-i18next](https://github.com/i18next/react-i18next) kirjastoa, joka puolestaa käyttää [i18next](https://www.i18next.com/) kirjastoa. React-komponenttien sisällä käytössä on [useTranslation](https://react.i18next.com/latest/usetranslation-hook)-hook. Käännökset haetaan lokalisaatio-service:ltä `kouta`-kategoriasta. Suomenkieliset käännökset on määritelty [translations/fi.js](https://github.com/Opetushallitus/kouta-ui/blob/master/src/main/app/src/translations/fi.js)-tiedostossa. Käännöksissä käytetään ensisijaisesti lokalisaatio-service:n tarjoamia käännöksiä. Uusien käännöksien lisäämisen kannattaa aloittaa lisäämällä suomenkielinen käännös `translations/fi.js`-tiedostoon.
