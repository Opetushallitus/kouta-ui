import axios from 'axios';
import {handleEvents, setState, setStates} from '../../utils/stateUtils';

import {urlEPerusteList, urlOsaamisalaKuvausList} from '../../config/urls';
import {findByKey, removeDuplicatesByFeature} from '../../utils/objectUtils';
import {APP_STATE_KOULUTUKSEN_TIEDOT} from './KoulutuksenTiedotStore';
import {LANGUAGE} from '../../config/constants';
import {AlakoodiItem, AlakoodiList} from '../../model/Alakoodi';
import {getLanguage} from '../generic/LanguageStore';

export const APP_STATE_KOULUTUKSEN_KUVAUS = 'APP_STATE_KOULUTUKSEN_KUVAUS';
export const APP_STATE_KOULUTUKSEN_OSAAMISALAT = 'APP_STATE_KOULUTUKSEN_OSAAMISALAT';
export const APP_STATE_KOULUTUKSEN_EPERUSTE_IDS = 'APP_STATE_KOULUTUKSEN_EPERUSTE_IDS';

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

export const APP_STATE_KOULUTUKSEN_OSAAMISALAKUVAUS_MAP = 'APP_STATE_KOULUTUKSEN_OSAAMISALAKUVAUS_MAP';
export const APP_STATE_KOULUTUKSEN_OSAAMISALA_OPTIONS = 'APP_STATE_KOULUTUKSEN_OSAAMISALA_OPTIONS';
export const APP_STATE_KOULUTUKSEN_OSAAMISALA_NAME_LIST = 'APP_STATE_KOULUTUKSEN_OSAAMISALA_NAME_LIST';

const setOsaamisalaKuvausData = (osaamisalaList) => {
  const entries = removeDuplicatesByFeature(osaamisalaList.map(entry => entry[0]), (entry) => entry.osaamisala.uri);
  const osaamisalakuvausMap = entries.map(entry => ({
    nimi: entry.nimi,
    uri: entry.osaamisala.uri,
    teksti: entry.teksti
  })).reduce((kuvausMap, entry) => ({
    ...kuvausMap,
    [entry['uri']]: entry
  }), {});

  const osaamisalaOptions = entries.map(entry => ({
    label: entry.nimi[getLanguage()],
    value: entry.osaamisala.uri
  }))

  const osaamisalaNameList = entries.map(entry => entry.nimi[getLanguage()]);

  setStates({
    [APP_STATE_KOULUTUKSEN_OSAAMISALAKUVAUS_MAP]: osaamisalakuvausMap,
    [APP_STATE_KOULUTUKSEN_OSAAMISALA_OPTIONS]: osaamisalaOptions,
    [APP_STATE_KOULUTUKSEN_OSAAMISALA_NAME_LIST]: osaamisalaNameList
  });
}

const loadOsaamisalaKuvausList = (ePerusteIds, osaamisalaList) => {
  if (ePerusteIds.length === 0) {
    return setOsaamisalaKuvausData(osaamisalaList);
  }
  const ePerusteId = ePerusteIds.shift();
  const url = urlOsaamisalaKuvausList(ePerusteId);
  axios.get(urlOsaamisalaKuvausList(ePerusteId)).then(response => {
    const data = response.data;
    const osaamisalaArray = findByKey(data, '^osaamisala_');
    osaamisalaList = osaamisalaList.concat(osaamisalaArray);
    loadOsaamisalaKuvausList(ePerusteIds, osaamisalaList);
  });
};

