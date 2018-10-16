import axios from 'axios';
import {getKoodiUri, getKoulutuksenNimi, getVersio} from './KoulutusDetailsStore';
import {getKoulutustyyppi} from './KoulutusListStore';
import {getUrlKoutaBackendKoulutus} from './UrlStore';
import {JULKAISUTILA, LANGUAGE, REQUEST_STATUS} from '../config/constants';
import {observe, updateState} from '../utils/utils';
import {APP_STATE_KOULUTUS_PERSISTENCY} from '../config/states';

export const ATTR_SAVE_AND_PUBLISH = 'saveAndPublish';
export const ATTR_SAVE = 'save';

export const KoulutusPersistencyStore = () => observe(APP_STATE_KOULUTUS_PERSISTENCY, {
  [ATTR_SAVE_AND_PUBLISH]: REQUEST_STATUS.ENABLED,
  [ATTR_SAVE]: REQUEST_STATUS.ENABLED
});

const buildJson = (julkaisutila) => ({
  "johtaaTutkintoon": true,
  "koulutustyyppi": getKoulutustyyppi(),
  "koulutusKoodiUri": getKoodiUri() + "#" + getVersio(),
  "tila": julkaisutila,
  "tarjoajat": ["2.2", "3.2", "4.2"],
  "nimi": {
    [LANGUAGE.toLowerCase()]: getKoulutuksenNimi()
  },
  "muokkaaja": "1.2.3.2.2"
});

const createKoulutus = (actionType, julkaisutila) =>
    axios.put(getUrlKoutaBackendKoulutus(), buildJson(julkaisutila))
    .then(r => setButtonStatus(actionType, REQUEST_STATUS.SUCCESS))
    .catch(e => setButtonStatus(actionType, REQUEST_STATUS.FAILURE));

export const saveAndPublishKoulutus = () => createKoulutus(ATTR_SAVE_AND_PUBLISH, JULKAISUTILA.JULKAISTU);

export const saveKoulutus = () => createKoulutus(ATTR_SAVE, JULKAISUTILA.TALLENNETTU);

const setButtonStatus = (actionType, status) => updateState(APP_STATE_KOULUTUS_PERSISTENCY, {
  [actionType]: status
});
