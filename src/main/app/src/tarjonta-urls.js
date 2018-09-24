const production = {
    // "kouta-backend.base-url" : "/",
    // "kouta-backend.koulutus" : "/kouta-backend/koulutus/",
    // "kouta-backend.toteutus" : "/kouta-backend/toteutus/",
};

const development = {
    "kouta-backend.base-url" : "http://localhost:" + process.env.REACT_APP_BACKEND_PORT,
    "kouta-backend.koulutus" : "http://localhost:" + process.env.REACT_APP_BACKEND_PORT + "/kouta-backend/koulutus",
    "kouta-backend.toteutus" : "http://localhost:" + process.env.REACT_APP_BACKEND_PORT + "/kouta-backend/toteutus",
};

export {production, development}