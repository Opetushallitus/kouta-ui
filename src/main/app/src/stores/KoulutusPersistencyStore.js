import axios from 'axios';
import {getKoodiUri, getVersio} from './KoulutusDetailsStore';
import {getKoulutustyyppi} from './KoulutusListStore';

export const KoulutusPersistencyStore = () => {
};

export const saveKoulutus = () => {
};

const getPlaceholderJson = () => ({
  "johtaaTutkintoon": true,
  "koulutustyyppi": getKoulutustyyppi(),
  "koulutusKoodiUri": getKoodiUri() + "#" + getVersio(),
  "tila": "julkaistu",
  "tarjoajat": ["2.2", "3.2", "4.2"],
  "nimi": {
    "fi": "kiva nimi",
    "sv": "nimi sv",
    "en": "nice name"
  },
  "muokkaaja": "1.2.3.2.2"
});

export const saveAndPublishKoulutus = () => {
  axios.put('http://localhost:8099/kouta-backend/koulutus/', getSampleJson()).then(r => console.log(r.status))
  .catch(e => console.log(e));
};
