const production = {
  'kouta-backend.base-url': '/',
  'kouta-backend.koulutus': '/kouta-backend/koulutus/',
  'kouta-backend.toteutus': '/kouta-backend/toteutus/',
  'kouta-backend.haku': '/kouta-backend/haku/',
  'kouta-backend.hakukohde': '/kouta-backend/hakukohde/',
  'kouta-backend.valintaperuste': '/kouta-backend/valintaperuste/'
};

const development = {
  'kouta-backend.base-url': 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT,
  'kouta-backend.koulutus': 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT + '/kouta-backend/koulutus',
  'kouta-backend.toteutus': 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT + '/kouta-backend/toteutus',
  'kouta-backend.haku': 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT + '/kouta-backend/haku',
  'kouta-backend.hakukohde': 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT + '/kouta-backend/hakukohde',
  'kouta-backend.valintaperuste': 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT + '/kouta-backend/valintaperuste'
};

export {production, development}
