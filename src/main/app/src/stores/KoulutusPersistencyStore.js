import axios from 'axios';
import {getKoodiUri, getVersio} from './KoulutusDetailsStore';
import {getKoulutustyyppi} from './KoulutusListStore';
import {getUrlKoutaBackendKoulutus} from './UrlStore';
import {JULKAISUTILA} from '../config/constants';

export const KoulutusPersistencyStore = () => {};

const buildJson = (julkaisutila) => ({
  "johtaaTutkintoon": true,
  "koulutustyyppi": getKoulutustyyppi(),
  "koulutusKoodiUri": getKoodiUri() + "#" + getVersio(),
  "tila": julkaisutila,
  "tarjoajat": ["2.2", "3.2", "4.2"],
  "nimi": {
    "fi": "kiva nimi",
    "sv": "nimi sv",
    "en": "nice name"
  },
  "muokkaaja": "1.2.3.2.2"
});

const createKoulutus = (julkaisutila) =>
    axios.put(getUrlKoutaBackendKoulutus(), buildJson(julkaisutila)).then(r => console.log(r.status)).catch(e => console.log(e));

export const saveAndPublishKoulutus = () => createKoulutus(JULKAISUTILA.JULKAISTU);

export const saveKoulutus = () => createKoulutus(JULKAISUTILA.TALLENNETTU);


