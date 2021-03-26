# Kouta-UI

Uuden koulutustarjonnan virkailijan käyttöliittymä.

Kouta-UI on luotu create-react-app:lla, ja se on kääritty Spring Boot 2.0 -sovellukseen, jonka ainoa tehtävä on jakaa käyttöliittymä.

[![Build Status](https://travis-ci.com/Opetushallitus/kouta-ui.svg?branch=master)](https://travis-ci.com/Opetushallitus/kouta-ui)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/4fd6253f529e45efaba604131e864189)](https://www.codacy.com/gh/Opetushallitus/kouta-ui/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Opetushallitus/kouta-ui&amp;utm_campaign=Badge_Grade)

## Arkkitehtuuri ja kirjastot

### Lomakkeiden logiikka

Lomakkeiden kenttien näkyvyys riippuu muiden kenttien arvoista sekä käyttäjän oikeuksista (joitakin kenttiä näytetään ainoastaan OPH-virkailijoille). Lomakkeiden kenttien näkyvyyksien määrittelyt on tämän kirjoitusaikana (joulukuu 2020) toteutettu osittain lomakkeiden React-komponenteissa ja osittain FormConfig-objekteissa. FormConfig-objektien takia osa lomakkeiden logiikasta sijaitsee erillään komponenteista joihin se vaikuttaa. Tämä aiheuttaa hämmennystä etenkin uusissa kehittäjissä. FormConfig-objekteissa määritelty lomakkeiden kenttien piilottamiseen/näyttämiseen liittyvä logiikka on päätetty siirtää lomakkeiden komponentteihin. 

Lomakkeiden tilan hallinta on toteutettu redux-form-kirjastolla. Redux-form *rekisteröi* kentän kun sitä vastaava komponentti renderöidään. Vastaavasti *rekisteröinti poistetaan* (unregister), kun kenttää vastaava komponentti poistetaan. Näiden redux-tapahtumien avulla tunnistetaan milloin käyttäjä on poistanut kentät itse näkyvistä ja niille halutaan lähettää tyhjä arvo. Tämä onnistuu, koska *unregister*-tapahtumaa ei lähetetä alussa kun kenttä on piilossa.

### Palvelinkyselyiden hallinta ja muistintaminen

Tämän kirjoitusaikana (joulukuu 2020) Kouta-UI:n API-kutsut on toteutettu usealla eri tavalla ja erilaisilla välimuistiratkaisuilla. Jotkin kyselyistä halutaan muistintaa pitkään (organisaatiopalvelu, eperusteet, koodisto jne.), ja joitakin vain hyvin lyhyen aikaa (kouta-backend). Haasteena on myös saman palvelimelta ladatun tiedon käyttäminen eri komponenteissa. Osittain on otettu käyttöön react-query, joka tarjoaa miellyttävän abstraktion palvelinpyyntöjen hallintaan. Samantyyppinen kouta-ui:ssa käytetty react-async-kirjasto ei tarjoa välimuistiratkaisuja ja jättää edelleen `useEffect`:in tapaan riippuvuuksien serialisoinnin käyttäjälle, mikä johtaa helposti ikuisiin latauslooppeihin ja muihin vastaaviin ongelmiin. Tavoite on korvata React-async kokonaan käyttäen react-query-kirjastoa.

## Käyttöliittymän kehittäminen

Kehityksen aikana käyttöliittymää kannattaa ajaa pelkästään nodella, jolloin muutokset näkyvät suoraan selaimessa.

`cd src/main/app`

`npm run start`

Hetken kuluttua käyttöliittymä on käytettävissä osoitteessa (selainta ei avata automaattisesti):

https://localhost:3000

**Huom! HTTPS-protokolla käytössä.** Webpack-dev-serverin proxy on konfiguroitu oletuksena ohjaamaan kaikki muut polut paitsi `/`, `/kouta` ja `/kouta/*` osoitteeseen `https://virkailija.hahtuvaopintopolku.fi`. Käytetään oletuksena self-signed-sertifikaatteja, eikä CORS-rajoituksia ei tarvitse kiertää selaimessa. Kehitysympäristön virkailija-osoitetta, johon proxytaan voi vaihtaa asettamalla ympäristömuuttujan `DEV_VIRKAILIJA_URL` eri arvoon (esim. `.env.local`-tiedostossa).

## Ajaminen lokaalisti kouta-backendin kanssa

Aiemmin lokaalia kehitystä varten on laitettu kouta-ui osoittamaan suoraan lokaaliin kouta-backendin lokaaliin osoitteeseen (eri portti), mutta selainten tietoturvakäytäntöjen kiristyessä tästä on tullut melko hankalaa. Chromen voi edelleen käynnistää `--disable-web-security`-optiolla, mutta sille on pakko antaa eri profiilihakemisto `--user-data-dir`-optiolla. Selaimen käynnistäminen ilman tietoturvaominaisuuksia tekee siitä erittäin haavoittuvaisen, jos sillä käynnistettyä selainta käytetään mihinkään muiden kuin lokaalien sivujen avaamiseen. Lisäksi `--user-data-dir`-optiolla täytyy antaa joka kerta tyhjä profiili tai `--disable-web-security`-optiolla ei ole mitään vaikutusta. On melko hankalaa, jos kehitystyössä käytettävät selainpluginit pitää asentaa joka kerta uudestaan. 

Jotta [kouta-backend](https://github.com/Opetushallitus/kouta-backend/) voisi kutsua kouta-ui:n lokaalin proxyn osoitteita, täytyy lokaalin proxyn sertifikaattien olla luotettuja kouta-backendin mielestä. Tähän voi käyttää esim. `mkcert`-työkalua, joka luo lokaalisti luotetun CA:n.

Asenna mkcert. Esim MacOS:ssä löytyy brew:lla:

`brew install mkcert`

Luo sertifikaatit ajamalla seuraavat komennot projektin juurihakemistossa:

    mkdir -p .cert
    mkcert -key-file ./.cert/key.pem -cert-file ./.cert/cert.pem "localhost"

Aseta create-react-app:n ympäristömuuttujat osoittamaan luotuihin sertifikaatteihin (esim. `.env.local`-tiedostossa):

    SSL_CRT_FILE=./.cert/cert.pem
    SSL_KEY_FILE=./.cert/key.pem

Varmista, että JAVA_HOME osoittaa kouta-backendin kehitysympäristön Javan kotihakemistoon, ja aja seuraava komento (luo lokaalin CA:n ja lisää sen järjestelmän lokaaleihin storeihin):

`mkcert -install`

Käynnistä Idea (ja käyttämästi selain) uudelleen, jotta ne ottavat käyttöön lokaalin CA:n. 

Korvaa kouta-backendissä dev-vars.yml-tiedostoon: 

    cas_url: https://localhost:3000/cas
    kouta_backend_cas_service: https://localhost:3000/kouta-backend/auth/login

Aseta kouta-ui:ssa ympäristömuuttuja (esim. `.env.local`-tiedostossa): 

`KOUTA_BACKEND_URL=http://localhost:8099`

Käynnistä kouta-ui lokaalisti komennolla: 

`npm run start`

Käynnistä VPN ja aseta reititykset/tunnelointi, jotta kouta-backend saa yhteyden käyttöoikeus-servicen `userDetails`-rajapintaan. 

Ilman kouta-indeksoijan ajamista lokaalisti etusivun listat eivät toimi, mutta luominen ja muokaaminen lomakkeiden avulla onnistuu.

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

Yksikkötestit löytyvät testattavan moduulin `*.test.jsx?` (esim. `components/Input/Input.test.jsx`) tiedostosta, tai sen `__tests__` kansiosta. Integraatiotestit löytyvät `cypress/integration` kansiosta.

Yksikkötestit voi ajaa komennolla `npm test` ja integraatiotestit komennolla `npm run test:integration`. Kaikki testit pystyy ajamaan komennolla `npm run test:ci`.

### Integraatiotestien ajaminen interaktiivisesti (Cypress)

Cypress-testejä voi ajaa myös interaktiivisesti käynnistämällä ensin kouta-ui:n integraatio-moodissa:

    cd src/main/app
    npm run start:integration

ja sitten samassa kansiossa, mutta toisessa shellissa: 

    npm run cypress:open
    
Cypress-integraatiotestit olettavat, että sovellus on renderöity käyttäen käännösavaimia, minkä vuoksi on käytettävä `npm start:integration`tai `npm start:integration:debug` komentoa sovelluksen käynnistämiseen. Npm Skripti `start:integration:debug` eroaa `start:integration`:sta siten, että se sallii sovelluksen kyselyt ulkopuolelle. Tämä helpottaa mm. cypressin-testien api-mockien päivittämistä ja testaamista, kun taas normaalisti integraatiotesteissä halutaan estää yhteydet ulkopuolisiin rajapintoihin.

### API-kutsujen mockaaminen

KTO-projektissa on toteutettu omat työkalut API-kutsujen mockauksen helpottamiseen. Työkalut ja niiden dokumentaatio löytyvät [kto-ui-common](https://github.com/Opetushallitus/kto-ui-common)-reposta. `Update-mocks.js`-skriptille on tehty käytön helpottamiseksi npm skripti `update-mocks`, jota siis kutsutaan komennolla `npm run update-mocks`. Muista käynnistää lokaali kehitysproxy (`npm run start`) ennen mockien päivitystä, jotta mockeille tulee oikeaa dataa localhostin kautta.

## Storybook

[Storybookin](https://github.com/storybooks/storybook) voi käynnistää komennolla `npm run storybook`. Käynnistymisen jälkeen Storybook löytyy osoitteesta [http://localhost:9009](http://localhost:9009). Komponenttien mahdolliset storyt löytyvät komponentin oman kansion `*.stories.jsx` (esim. `components/Alert/Alert.stories.jsx`) tiedostosta. Hyödyllisiä story [dekoraattoreita](https://storybook.js.org/docs/addons/introduction/#1-decorators) (esim. lokalisaatio- ja api-dekoraattorit) löytyy `storybookUtils.js` tiedostosta.

## Lokalisaatio

Lokalisointiin käytetään [react-i18next](https://github.com/i18next/react-i18next) kirjastoa, joka puolestaa käyttää [i18next](https://www.i18next.com/) kirjastoa. React-komponenttien sisällä käytössä on [useTranslation](https://react.i18next.com/latest/usetranslation-hook)-hook. Käännökset haetaan lokalisaatio-service:ltä `kouta`-kategoriasta. Suomenkieliset käännökset on määritelty [translations/fi.js](https://github.com/Opetushallitus/kouta-ui/blob/master/src/main/app/src/translations/fi.js)-tiedostossa. Käännöksissä käytetään ensisijaisesti lokalisaatio-service:n tarjoamia käännöksiä. Uusien käännöksien lisäämisen kannattaa aloittaa lisäämällä suomenkielinen käännös `translations/fi.js`-tiedostoon.
