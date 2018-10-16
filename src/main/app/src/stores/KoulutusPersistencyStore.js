import axios from 'axios';
import {getKoodiUri, getKoulutuksenNimi, getVersio} from './KoulutusDetailsStore';
import {getKoulutustyyppi} from './KoulutusListStore';
import {getUrlKoutaBackendKoulutus} from './UrlStore';
import {JULKAISUTILA, LANGUAGE} from '../config/constants';
import {updateState} from '../utils/utils';
import {APP_STATE_KOULUTUS_PERSISTENCY} from '../config/states';

export const KoulutusPersistencyStore = () => {};

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

const createKoulutus = (julkaisutila) =>
    axios.put(getUrlKoutaBackendKoulutus(), buildJson(julkaisutila)).then(r => setPersistencyStatus(julkaisutila)).catch(e => console.log(e));

export const saveAndPublishKoulutus = () => createKoulutus(JULKAISUTILA.JULKAISTU);

export const saveKoulutus = () => createKoulutus(JULKAISUTILA.TALLENNETTU);

export const setPersistencyStatus = (julkaisutila) => updateState(APP_STATE_KOULUTUS_PERSISTENCY, {[julkaisutila]: true })

