import {urls as ophUrls} from 'oph-urls-js';
import {development, production} from '../../backend-and-service-urls';

export const UrlStore = () => configure();

export const urls = () => ophUrls;

const configure = () => {
  configureEnvironment(ophUrls);
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
};