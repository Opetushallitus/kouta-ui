import axios from 'axios';
import {handleEvents, setState, setStates} from '../../utils/stateUtils';
import {
  APP_STATE_KOULUTUKSEN_EPERUSTE_IDS,
  APP_STATE_KOULUTUKSEN_KUVAUS,
  APP_STATE_KOULUTUKSEN_OSAAMISALAT,
  APP_STATE_KOULUTUKUSEN_OSAAMISALAKUVAUS_MAP
} from '../../config/states';
import {urlEPerusteList, urlOsaamisalaKuvausList} from '../../config/urls';
import {findByKey} from '../../utils/objectUtils';
import {APP_STATE_KOULUTUKSEN_TIEDOT} from "./KoulutuksenTiedotStore";

export const KoulutuksenKuvausStore = () => handleEvents({
  [APP_STATE_KOULUTUKSEN_TIEDOT]: (details) => loadEPerusteList(details),
  [APP_STATE_KOULUTUKSEN_EPERUSTE_IDS]: (ePerusteIds) => loadOsaamisalaKuvausList(ePerusteIds, [])
});

const loadEPerusteList = (details) => {
  if (!details.enabled || !details.koodiArvo) {
    return;
  }
  const url = urlEPerusteList(details.koodiArvo);
  axios.get(url).then(response => configureEPerusteListData(response.data));
};

const configureEPerusteListData = (data) => {
  const ePerusteArray = data.data;
  const perusteIds = [];
  let koulutuksenKuvaus = null;
  const osaamisalaByArvo = {};
  ePerusteArray.forEach(ePeruste => {
    perusteIds.push(ePeruste.id);
    koulutuksenKuvaus = ePeruste.kuvaus;
    let osaamisalat = ePeruste.osaamisalat;
    osaamisalat.forEach(osaamisala => osaamisalaByArvo[osaamisala.arvo] = osaamisala);
  });
  setStates({
    [APP_STATE_KOULUTUKSEN_EPERUSTE_IDS]: perusteIds,
    [APP_STATE_KOULUTUKSEN_KUVAUS]: koulutuksenKuvaus,
    [APP_STATE_KOULUTUKSEN_OSAAMISALAT]: Object.values(osaamisalaByArvo)
  });
};

const setOsaamisalaKuvausData = (osaamisalaList) =>
  setState(APP_STATE_KOULUTUKUSEN_OSAAMISALAKUVAUS_MAP, osaamisalaList.map(entry => entry[0]).map(entry => ({
    nimi: entry.nimi,
    uri: entry.osaamisala.uri,
    teksti: entry.teksti
  })).reduce((kuvausMap, entry) => ({
    ...kuvausMap,
    [entry['uri']]: entry
  }), {})
);

const loadOsaamisalaKuvausList = (ePerusteIds, osaamisalaList) => {
  if (ePerusteIds.length === 0) {
    return setOsaamisalaKuvausData(osaamisalaList);
  }
  const ePerusteId = ePerusteIds.shift();

  axios.get(urlOsaamisalaKuvausList(ePerusteId)).then(response => {
    const data = response.data;
    const osaamisalaArray = findByKey(data, '^osaamisala_');
    osaamisalaList = osaamisalaList.concat(osaamisalaArray);
    loadOsaamisalaKuvausList(ePerusteIds, osaamisalaList);
  });
};

