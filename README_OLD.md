## Ajaminen lokaalisti kouta-backendin kanssa

Aiemmin lokaalia kehitystä varten on laitettu kouta-ui osoittamaan suoraan lokaaliin kouta-backendin lokaaliin osoitteeseen (eri portti), mutta selainten tietoturvakäytäntöjen kiristyessä tästä on tullut melko hankalaa. Chromen voi edelleen käynnistää `--disable-web-security`-optiolla, mutta sille on pakko antaa eri profiilihakemisto `--user-data-dir`-optiolla. Selaimen käynnistäminen ilman tietoturvaominaisuuksia tekee siitä erittäin haavoittuvaisen, jos sillä käynnistettyä selainta käytetään mihinkään muiden kuin lokaalien sivujen avaamiseen. Lisäksi `--user-data-dir`-optiolla täytyy antaa joka kerta tyhjä profiili tai `--disable-web-security`-optiolla ei ole mitään vaikutusta. On melko hankalaa, jos kehitystyössä käytettävät selainpluginit pitää asentaa joka kerta uudestaan. 

Jotta [kouta-backend](https://github.com/Opetushallitus/kouta-backend/) voisi kutsua kouta-ui:n lokaalin proxyn osoitteita, täytyy lokaalin proxyn sertifikaattien olla luotettuja kouta-backendin mielestä. Tähän voi käyttää esim. `mkcert`-työkalua, joka luo lokaalisti luotetun CA:n.

Asenna mkcert. Esim MacOS:ssä löytyy brew:lla:

`brew install mkcert`

Luo sertifikaatit ajamalla seuraavat komennot kouta-ui:n app-hakemistossa:

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
    
ja käynnistä kouta-backend (EmbeddedJettyLauncher).

Aseta kouta-ui:ssa ympäristömuuttuja (esim. `.env.local`-tiedostossa): 

`KOUTA_BACKEND_URL=http://localhost:8099`

Käynnistä kouta-ui lokaalisti komennolla: 

`npm run start`

Käynnistä Opintopolun VPN, jotta kouta-backend saa yhteyden käyttöoikeus-servicen `userDetails`-rajapintaan. 

Ilman kouta-indeksoijan ajamista lokaalisti etusivun listat eivät toimi, mutta luominen ja muokaaminen lomakkeiden avulla onnistuu.