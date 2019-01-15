const production = {
  "kouta-backend.base-url": "/",
  "kouta-backend.koulutus": "/kouta-backend/koulutus",
  "kouta-backend.koulutus-by-oid": "/kouta-backend/koulutus/$1",
  "kouta-backend.koulutus-list": "/kouta-backend/koulutus/list",
  "kouta-backend.toteutus": "/kouta-backend/toteutus",
  "kouta-backend.toteutus-by-oid": "/kouta-backend/toteutus/$1",
  "kouta-backend.toteutus-list": "/kouta-backend/toteutus/list",
  "kouta-backend.haku": "/kouta-backend/haku",
  "kouta-backend.haku-by-oid": "/kouta-backend/haku/$1",
  "kouta-backend.haku-list": "/kouta-backend/haku/list",
  "kouta-backend.hakukohde": "/kouta-backend/hakukohde",
  "kouta-backend.hakukohde-by-oid": "/kouta-backend/hakukohde/$1",
  "kouta-backend.hakukohde-list": "/kouta-backend/hakukohde/list",
  "kouta-backend.valintaperuste": "/kouta-backend/valintaperuste",
  "kouta-backend.valintaperuste-by-oid": "/kouta-backend/valintaperuste/$1",
  "kouta-backend.valintaperuste-list": "/kouta-backend/valintaperuste/list",
  "koodisto-service.base-url": "/",
  "koodisto-service.sisaltyy-alakoodit":
    "/koodisto-service/rest/json/relaatio/sisaltyy-alakoodit/$1?koodiVersio=$2",
  "koodisto-service.sisaltyy-ylakoodit":
    "/koodisto-service/rest/json/relaatio/sisaltyy-ylakoodit/$1",
  "koodisto-service.koodi":
    "/koodisto-service/rest/json/$1/koodi?onlyValidKoodis=true",
  "eperusteet-service.base-url": "/",
  "eperusteet-service.perusteet-koulutuskoodilla":
    "/eperusteet-service/api/perusteet?tuleva=true&siirtyma=false&voimassaolo=true&poistunut=false&kieli=fi&koulutuskoodi=$1",
  "eperusteet-service.osaamisalakuvaukset":
    "/eperusteet-service/api/perusteet/$1/osaamisalakuvaukset",
  "organisaatio-service.base-url": "/",
  "organisaatio-service.children":
    "/organisaatio-service/rest/organisaatio/v4/$1/children?includeImage=false"
};

const development = {
  "kouta-backend.base-url":
    "http://localhost:" + process.env.REACT_APP_BACKEND_PORT,
  "kouta-backend.koulutus":
    "http://localhost:" +
    process.env.REACT_APP_BACKEND_PORT +
    "/kouta-backend/koulutus",
  "kouta-backend.koulutus-by-oid":
    "http://localhost:" +
    process.env.REACT_APP_BACKEND_PORT +
    "/kouta-backend/koulutus/$1",
  "kouta-backend.koulutus-list":
    "http://localhost:" +
    process.env.REACT_APP_BACKEND_PORT +
    "/kouta-backend/koulutus/list",
  "kouta-backend.toteutus":
    "http://localhost:" +
    process.env.REACT_APP_BACKEND_PORT +
    "/kouta-backend/toteutus",
  "kouta-backend.toteutus-by-oid":
    "http://localhost:" +
    process.env.REACT_APP_BACKEND_PORT +
    "/kouta-backend/toteutus/$1",
  "kouta-backend.toteutus-list":
    "http://localhost:" +
    process.env.REACT_APP_BACKEND_PORT +
    "/kouta-backend/toteutus/list",
  "kouta-backend.haku":
    "http://localhost:" +
    process.env.REACT_APP_BACKEND_PORT +
    "/kouta-backend/haku",
  "kouta-backend.haku-by-oid":
    "http://localhost:" +
    process.env.REACT_APP_BACKEND_PORT +
    "/kouta-backend/haku/$1",
  "kouta-backend.haku-list":
    "http://localhost:" +
    process.env.REACT_APP_BACKEND_PORT +
    "/kouta-backend/haku/list",
  "kouta-backend.hakukohde":
    "http://localhost:" +
    process.env.REACT_APP_BACKEND_PORT +
    "/kouta-backend/hakukohde",
  "kouta-backend.hakukohde-by-oid":
    "http://localhost:" +
    process.env.REACT_APP_BACKEND_PORT +
    "/kouta-backend/hakukohde/$1",
  "kouta-backend.hakukohde-list":
    "http://localhost:" +
    process.env.REACT_APP_BACKEND_PORT +
    "/kouta-backend/hakukohde/list",
  "kouta-backend.valintaperuste":
    "http://localhost:" +
    process.env.REACT_APP_BACKEND_PORT +
    "/kouta-backend/valintaperuste",
  "kouta-backend.valintaperuste-by-oid":
    "http://localhost:" +
    process.env.REACT_APP_BACKEND_PORT +
    "/kouta-backend/valintaperuste/$1",
  "kouta-backend.valintaperuste-list":
    "http://localhost:" +
    process.env.REACT_APP_BACKEND_PORT +
    "/kouta-backend/valintaperuste/list",
  "koodisto-service.base-url":
    "https://virkailija.hahtuvaopintopolku.fi/koodisto-service",
  "koodisto-service.sisaltyy-alakoodit":
    "https://virkailija.hahtuvaopintopolku.fi/koodisto-service/rest/json/relaatio/sisaltyy-alakoodit/$1?koodiVersio=$2",
  "koodisto-service.sisaltyy-ylakoodit":
    "https://virkailija.hahtuvaopintopolku.fi/koodisto-service/rest/json/relaatio/sisaltyy-ylakoodit/$1",
  "koodisto-service.koodi":
    "https://virkailija.hahtuvaopintopolku.fi/koodisto-service/rest/json/$1/koodi?onlyValidKoodis=true",
  "eperusteet-service.base-url":
    "https://virkailija.hahtuvaopintopolku.fi/eperusteet-service",
  "eperusteet-service.perusteet-koulutuskoodilla":
    "https://virkailija.hahtuvaopintopolku.fi/eperusteet-service/api/perusteet?tuleva=true&siirtyma=false&voimassaolo=true&poistunut=false&kieli=fi&koulutuskoodi=$1",
  "eperusteet-service.osaamisalakuvaukset":
    "https://virkailija.hahtuvaopintopolku.fi/eperusteet-service/api/perusteet/$1/osaamisalakuvaukset",
  "organisaatio-service.base-url":
    "https://virkailija.hahtuvaopintopolku.fi/organisaatio-service",
  "organisaatio-service.children":
    "https://virkailija.hahtuvaopintopolku.fi/organisaatio-service/rest/organisaatio/v4/$1/children?includeImage=false"
};

export { production, development };
