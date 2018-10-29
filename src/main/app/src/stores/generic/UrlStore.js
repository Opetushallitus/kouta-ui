import {APP_STATE_URL} from '../../config/states';
import {urls as ophUrls} from 'oph-urls-js';
import {development, production} from '../../tarjonta-urls';
import {getState, updateState} from '../../utils/stateUtils';

const ATTR_URL_KOUTA_BACKEND_KOULUTUS = 'urlKoutaBackendKoulutus';

export const UrlStore = () => configure();

const configure = () => {
  configureEnvironment(ophUrls);
  const urlKoutaBackendKoulutus = ophUrls.url('kouta-backend.koulutus');
  updateState(APP_STATE_URL, {
    urls: ophUrls,
    [ATTR_URL_KOUTA_BACKEND_KOULUTUS]: urlKoutaBackendKoulutus
  })
};

async function configureEnvironment(urls) {
  console.log('Ollaan ympäristössä ' + process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    urls.addProperties(development);
  } else {
    urls.addProperties(production);
    await loadFrontProperties(urls);
  }
};

async function loadFrontProperties(urls) {
  await urls.load({overrides: '/kouta/rest/config/frontProperties'});
}

export const getUrlKoutaBackendKoulutus = () => getState(APP_STATE_URL, ATTR_URL_KOUTA_BACKEND_KOULUTUS);

export const getUrlKoutaBackendKoulutusList = () => `${getUrlKoutaBackendKoulutus()}/list`;
