import {urls as ophUrls} from 'oph-urls-js';
import {development, production} from '../../tarjonta-urls';
import {getState, updateState} from '../../utils/stateUtils';

export const APP_STATE_URL = 'APP_STATE_URL';

export const UrlStore = () => configure();

const keyKoulutus = 'koulutus';
const keyToteutus = 'toteutus';
const keyHaku = 'haku';
const keyHakukohde = 'hakukohde';
const keyValintaperuste = 'valintaperuste';

const configure = () => {
  configureEnvironment(ophUrls);
  const valueKoulutus = ophUrls.url('kouta-backend.koulutus');
  const valueToteutus = ophUrls.url('kouta-backend.toteutus');
  const valueHaku = ophUrls.url('kouta-backend.haku');
  const valueHakukohde = ophUrls.url('kouta-backend.hakukohde');
  const valueValintaperuste = ophUrls.url('kouta-backend.valintaperuste');
  updateState(APP_STATE_URL, {
    urls: ophUrls,
    [keyKoulutus]: valueKoulutus,
    [keyToteutus]: valueToteutus,
    [keyHaku]: valueHaku,
    [keyHakukohde]: valueHakukohde,
    [keyValintaperuste]: valueValintaperuste
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

export const getUrlKoutaBackendKoulutus = () => getState(APP_STATE_URL, keyKoulutus);
export const getUrlKoutaBackendToteutus = () => getState(APP_STATE_URL, keyToteutus);
export const getUrlKoutaBackendHaku = () => getState(APP_STATE_URL, keyHaku);
export const getUrlKoutaBackendHakukohde = () => getState(APP_STATE_URL, keyHakukohde);
export const getUrlKoutaBackendValintaperuste = () => getState(APP_STATE_URL, keyValintaperuste);

export const getUrlKoutaBackendKoulutusList = () => `${getUrlKoutaBackendKoulutus()}/list`;
export const getUrlKoutaBackendToteutusList = () => `${getUrlKoutaBackendToteutus()}/list`;
export const getUrlKoutaBackendHakuList = () => `${getUrlKoutaBackendHaku()}/list`;
export const getUrlKoutaBackendHakukohdeList = () => `${getUrlKoutaBackendHakukohde()}/list`;
export const getUrlKoutaBackendValintaperusteList = () => `${getUrlKoutaBackendValintaperuste()}/list`;



