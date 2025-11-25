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

`pnpm run start`

Hetken kuluttua käyttöliittymä on käytettävissä osoitteessa (selainta ei avata automaattisesti):

https://localhost:3000

**Huom! HTTPS-protokolla käytössä.** Webpack-dev-serverin proxy on konfiguroitu oletuksena ohjaamaan kaikki muut polut paitsi `/`, `/kouta` ja `/kouta/*` osoitteeseen `https://virkailija.hahtuvaopintopolku.fi`. Käytetään oletuksena self-signed-sertifikaatteja, eikä CORS-rajoituksia ei tarvitse kiertää selaimessa. Kehitysympäristön virkailija-osoitetta, johon proxytaan voi vaihtaa asettamalla ympäristömuuttujan `DEV_VIRKAILIJA_URL` eri arvoon `.env.development.local`-tiedostossa.

## Suositellut kehitystyökalut ja pluginit

Kehittämisessä suositeltava editori on "Visual Studio Code", mutta sen käyttäminen ei ole pakollista. Hyödyllisiä VSCode-plugineja ovat mm:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) näyttää ESLint-virheet editorissa. Erillistä prettier-pluginia ei tarvita, koska ne mäpätään eslint-varoituksiksi.
- [XState VSCode](https://marketplace.visualstudio.com/items?itemName=statelyai.stately-vscode) tarjoaa monenlaisia työkaluja xstate-tilakoneiden kanssa työskentelyyn.
- [Total Typescript](https://marketplace.visualstudio.com/items?itemName=mattpocock.ts-error-translator) tekee TypeScript-virheistä helpommin ymmärrettäviä ja näyttää opettavaisia selityksiä erilaisille TypeScript-rakenteille.
- [vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=styled-components.vscode-styled-components) auttaa erityisesti styled-components-kirjaston CSS-template-stringien kanssa.

## Koodin tyyli ja tarkistus (ESLint & Prettier)

Käytössä on ESlint ja Prettier koodin tyylin yhdenmukaistamiseksi ja staattiseen tarkistamiseen. Prettier ajetaan eslint-sääntönä, joten prettierin ajaminen JS/TS-tiedostoille erikseen ei ole tarpeen. Lisäksi eslint ajetaan Huskyn ja Lint-staged:n avulla Git precommit-hookissa, jolloin korjataan ne virheet/varoitukset, jotka pystytään. Jos ei kaikkea pystytty korjaamaan, commit epäonnistuu ja käyttäjän täytyy korjata jäljellä olevat ongelmat käsin.

ESLintin voi ajaa käsin komennolla `pnpm run lint`, tai automaattisen fiksauksen kanssa `pnpm run lint:fix`.

## Ajaminen lokaalisti kouta-backendin kanssa

Korvaa kouta-backendissä `dev-vars.yml`-tiedostoon:

    cas_url: https://localhost:3000/cas
    kouta_backend_cas_service: https://localhost:3000/kouta-backend/auth/login

ja käynnistä kouta-backend (EmbeddedJettyLauncher).

Aseta kouta-ui:ssa ympäristömuuttuja (esim. `.env.development.local`-tiedostossa):

`KOUTA_BACKEND_URL=http://localhost:8099`

Käynnistä kouta-ui lokaalisti komennolla:

`pnpm run start`

Käynnistä Opintopolun VPN, jotta kouta-backend saa yhteyden käyttöoikeus-servicen `userDetails`-rajapintaan.

Kirjaudu selaimella linkistä http://localhost:8099/kouta-backend/auth/login

Tämän jälkeen mene selaimella osoitteeseen https://localhost:3000/kouta

## Ajaminen lokaalisti kouta-backendin kanssa testiympäristöä vasten

Käynnistä Opintopolun VPN

Käynnistä kouta-backend sen README:ssa olevan osion (3.4.1 Ajo testiympäristöä vasten) ohjeen mukaan.

Aseta kouta-ui:ssa ympäristömuuttuja (esim. `.env.local`-tiedostossa): 

`KOUTA_BACKEND_URL=http://localhost:8099`

Käynnistä kouta-ui lokaalisti komennolla: 

`pnpm run start`

Kirjaudu selaimella linkistä http://localhost:8099/kouta-backend/auth/login

Mene selaimella osoitteeseen https://localhost:3000/virkailijan-tyopoyta/ ja kirjaudu.

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

## Yksikkötestit

Yksikkötestit on toteutettu Jest-kirjastolla. Ne löytyvät testattavan moduulin `*.test.jsx?` (esim. `components/Input/Input.test.jsx`) tiedostosta, ja ne voi ajaa komennolla `pnpm run test`. 

## Integraatiotestit

Koko sovellusta vasten ajettavat testit on toteutettu [Playwright](https://playwright.dev)-kirjastolla. 
Ensimmäisellä kerralla, ja aina kun Playwright-riippuvuus päivittyy, täytyy sen käyttämät selaimet riippuvuuksineen asentaa käsin komennolla:

    pnpm exec playwright install

Playwright-testit olettavat kälin löytyvän ajossa portista `3000` (ks. otsikko "Käyttöliittymän kehittäminen" yllä).
Jos haluat ajaa **kaikki** testit kannattaa tehdä kuten Github Actionsissa, eli buildata ja servata sovellus:

    pnpm run build:test
    pnpm run serve:test

ja ajaa sitten kaikki testit toisessa terminaalissa komennolla

    pnpm exec playwrigh

Playwright-testejä voi ajaa myös dev-serveriä vasten, mutta se on paljon hitaampaa kuin servattua tuotanto-buildia vasten. Aikakatkaisuja voi tulla, vaikka rajoja on kasvatettu. Playwright-testit olettavat, että sovellus on renderöity käyttäen käännösavaimia, minkä vuoksi on käytettävä `pnpm run start:integration`tai `pnpm run start:integration:debug` komentoa dev-serverin käynnistämiseen. NPM-skripti `start:integration:debug` eroaa `start:integration`:sta siten, että se sallii sovelluksen kyselyt ulkopuolelle, jolloin sovellusta voi testailla selaimella muutenkin. Tällöin täytyy kuitenkin olla tarkkana, että muistaa lisätä fixtuurit tarvittaville API-kyselyille.

Kun sovellus on ajossa, kätevintä yksittäisten Playwright-testien ajaminen ja debuggaminen on käyttämällä "Visual Studio Code"-editorissa virallista Playwright-pluginia: https://playwright.dev/docs/getting-started-vscode

Yksittäisiä testejä voi myös ajaa [Playwrightin UI-moodissa](https://playwright.dev/docs/test-ui-mode), jonka saa käynnistettyä komennolla:

    pnpm exec playwright test --ui

## Lokalisaatio

Lokalisointiin käytetään [react-i18next](https://github.com/i18next/react-i18next) kirjastoa, joka puolestaa käyttää [i18next](https://www.i18next.com/) kirjastoa. React-komponenttien sisällä käytössä on [useTranslation](https://react.i18next.com/latest/usetranslation-hook)-hook. Käännökset haetaan lokalisaatio-service:ltä `kouta`-kategoriasta. Suomenkieliset käännökset on määritelty [translations/fi.js](https://github.com/Opetushallitus/kouta-ui/blob/master/src/main/app/src/translations/fi.js)-tiedostossa. Käännöksissä käytetään ensisijaisesti lokalisaatio-service:n tarjoamia käännöksiä. Uusien käännöksien lisäämisen kannattaa aloittaa lisäämällä suomenkielinen käännös `translations/fi.json`-tiedostoon.

## Backend-apin tyypitys

types/kouta-backend.api.ts on autogeneroitu kouta-backendin swaggerista openapi-typescript-kirjastolla. Jos teet muutoksia backendin tyypityksiin, päivitä tiedosto halutusta backend-ympäristöstä (ml. lokaali):

`npx openapi-typescript https://virkailija.hahtuvaopintopolku.fi/kouta-backend/swagger/swagger.yaml -o ./src/types/kouta-backend.api.ts`
