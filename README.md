# Kouta-UI

Koulutustarjonnan virkailijan käyttöliittymä. React-kirjastolla kehitetty SPA (single page app), jonka varsinainen koodi sijaitsee hakemistossa `src/main/app`. Juurihakemiston Spring Boot -kääre tarjoilee SPA:n ympäristökohtaisten asetusten kanssa, kun sovellus asennetaan pilveen.

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

## Suositellut kehitystyökalut ja pluginit

Kehittämisessä suositeltava editori on "Visual Studio Code", mutta sen käyttäminen ei ole pakollista. Hyödyllisiä VSCode-plugineja ovat mm:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) näyttää ESLint-virheet editorissa. Erillistä prettier-pluginia ei tarvita, koska ne mäpätään eslint-varoituksiksi.
- [XState VSCode](https://marketplace.visualstudio.com/items?itemName=statelyai.stately-vscode) tarjoaa monenlaisia työkaluja xstate-tilakoneiden kanssa työskentelyyn.
- [Total Typescript](https://marketplace.visualstudio.com/items?itemName=mattpocock.ts-error-translator) tekee TypeScript-virheistä helpommin ymmärrettäviä ja näyttää opettavaisia selityksiä erilaisille TypeScript-rakenteille.
- [vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=styled-components.vscode-styled-components) auttaa erityisesti styled-components-kirjaston CSS-template-stringien kanssa.

## Koodin tyyli ja tarkistus (ESLint & Prettier)

Käytössä on ESlint ja Prettier koodin tyylin yhdenmukaistamiseksi ja staattiseen tarkistamiseen. Prettier ajetaan eslint-sääntönä, joten prettierin ajaminen JS/TS-tiedostoille erikseen ei ole tarpeen. Lisäksi eslint ajetaan Huskyn ja Lint-staged:n avulla Git precommit-hookissa, jolloin korjataan ne virheet/varoitukset, jotka pystytään. Jos ei kaikkea pystytty korjaamaan, commit epäonnistuu ja käyttäjän täytyy korjata jäljellä olevat ongelmat käsin.

ESLintin voi ajaa käsin komennolla `npm run lint`, tai automaattisen fiksauksen kanssa `npm run lint:fix`.

## Ajaminen lokaalisti kouta-backendin kanssa

Jotta [kouta-backend](https://github.com/Opetushallitus/kouta-backend/) voisi kutsua kouta-ui:n lokaalin proxyn osoitteita, täytyy lokaalin proxyn sertifikaattien olla luotettuja kouta-backendin mielestä. Tähän voi käyttää esim. [mkcert](https://mkcert.org/)-työkalua, joka luo lokaalisti luotetun CA:n (Certificate Authority). 

Kouta-UI:ssa on käytössä `vite-plugin-mkcert`, joka asentaa tarvittavat tiedostot (mukaan lukien mkcert-binäärin) käyttäjän kotihakemistoon `.vite-plugin-mkcert`-hakemistoon. Varmista, että JAVA_HOME-ympäristömuuttuja osoittaa kouta-backendin käyttämän Javan kotihakemistoon ennen kuin käynnistät kouta-ui:n lokaalisti, jotta edellä mainittu plugin osaa lisätä sertifikaatit myös oikean Javan CA:han.

Korvaa kouta-backendissä `dev-vars.yml`-tiedostoon: 

    cas_url: https://localhost:3000/cas
    kouta_backend_cas_service: https://localhost:3000/kouta-backend/auth/login
    
ja käynnistä kouta-backend (EmbeddedJettyLauncher).

Aseta kouta-ui:ssa ympäristömuuttuja (esim. `.env.local`-tiedostossa): 

`KOUTA_BACKEND_URL=http://localhost:8099`

Käynnistä kouta-ui lokaalisti komennolla: 

`npm run start`

Käynnistä Opintopolun VPN, jotta kouta-backend saa yhteyden käyttöoikeus-servicen `userDetails`-rajapintaan. 

Tämän jälkeen mene selaimella osoitteeseen https://localhost:3000/kouta. Kouta-UI:n pitäisi ohjata login-sivulle, jossa voit kirjautua sisään.

Jos kouta-backend edelleen valittaa, että sertifikaatit eivät ole luotettuja, varmista että ne on lisätty oikean Javan CA:han. Jos ei ole, aseta JAVA_HOME-ympäristömuuttuja osoittamaan oikeaan polkuun ja aja komento:

`~/.vite-plugin-mkcert/mkcert -install`

Käynnistä sitten IntelliJ Idea uudelleen.

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

## Yksikkötestit

Yksikkötestit on toteutettu Jest-kirjastolla. Ne löytyvät testattavan moduulin `*.test.jsx?` (esim. `components/Input/Input.test.jsx`) tiedostosta, ja ne voi ajaa komennolla `npm run test`. 

## Integraatiotestit

Koko sovellusta vasten ajettavat testit on toteutettu [Playwright](https://playwright.dev)-kirjastolla. 
Ensimmäisellä kerralla, ja aina kun Playwright-riippuvuus päivittyy, täytyy sen käyttämät selaimet riippuvuuksineen asentaa käsin komennolla:

    npx playwright install

Playwright-testit olettavat kälin löytyvän ajossa portista `3000` (ks. otsikko "Käyttöliittymän kehittäminen" yllä).
Jos haluat ajaa **kaikki** testit kannattaa tehdä kuten Github Actionsissa, eli buildata ja servata sovellus:

    npm run build:test
    npm run serve:test

ja ajaa sitten kaikki testit toisessa terminaalissa komennolla

    npx playwright test

Playwright-testejä voi ajaa myös dev-serveriä vasten, mutta se on paljon hitaampaa kuin servattua tuotanto-buildia vasten. Aikakatkaisuja voi tulla, vaikka rajoja on kasvatettu. Playwright-testit olettavat, että sovellus on renderöity käyttäen käännösavaimia, minkä vuoksi on käytettävä `npm run start:integration`tai `npm run start:integration:debug` komentoa dev-serverin käynnistämiseen. NPM-skripti `start:integration:debug` eroaa `start:integration`:sta siten, että se sallii sovelluksen kyselyt ulkopuolelle, jolloin sovellusta voi testailla selaimella muutenkin. Tällöin täytyy kuitenkin olla tarkkana, että muistaa lisätä fixtuurit tarvittaville API-kyselyille.

Kun sovellus on ajossa, kätevintä yksittäisten Playwright-testien ajaminen ja debuggaminen on käyttämällä "Visual Studio Code"-editorissa virallista Playwright-pluginia: https://playwright.dev/docs/getting-started-vscode

Yksittäisiä testejä voi myös ajaa [Playwrightin UI-moodissa](https://playwright.dev/docs/test-ui-mode), jonka saa käynnistettyä komennolla:

    npx playwright test --ui

## Storybook

[Storybookin](https://github.com/storybooks/storybook) voi käynnistää komennolla `npm run storybook`. Käynnistymisen jälkeen Storybook löytyy osoitteesta [http://localhost:9009](http://localhost:9009). Komponenttien mahdolliset storyt löytyvät komponentin oman kansion `*.stories.jsx` (esim. `components/Alert/Alert.stories.jsx`) tiedostosta. Hyödyllisiä story [dekoraattoreita](https://storybook.js.org/docs/addons/introduction/#1-decorators) (esim. lokalisaatio- ja api-dekoraattorit) löytyy `storybookUtils.js` tiedostosta.

## Lokalisaatio

Lokalisointiin käytetään [react-i18next](https://github.com/i18next/react-i18next) kirjastoa, joka puolestaa käyttää [i18next](https://www.i18next.com/) kirjastoa. React-komponenttien sisällä käytössä on [useTranslation](https://react.i18next.com/latest/usetranslation-hook)-hook. Käännökset haetaan lokalisaatio-service:ltä `kouta`-kategoriasta. Suomenkieliset käännökset on määritelty [translations/fi.js](https://github.com/Opetushallitus/kouta-ui/blob/master/src/main/app/src/translations/fi.js)-tiedostossa. Käännöksissä käytetään ensisijaisesti lokalisaatio-service:n tarjoamia käännöksiä. Uusien käännöksien lisäämisen kannattaa aloittaa lisäämällä suomenkielinen käännös `translations/fi.json`-tiedostoon.

## Backend-apin tyypitys

types/kouta-backend.api.ts on autogeneroitu kouta-backendin swaggerista openapi-typescript-kirjastolla. Jos teet muutoksia backendin tyypityksiin, päivitä tiedosto halutusta backend-ympäristöstä (ml. lokaali):

`npx openapi-typescript https://virkailija.hahtuvaopintopolku.fi/kouta-backend/swagger/swagger.yaml -o ./src/types/kouta-backend.api.ts`