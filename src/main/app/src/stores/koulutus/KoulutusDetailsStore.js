import axios from 'axios';
import {AlakoodiItem, AlakoodiList} from '../../model/Alakoodi';
import {clearValues, getState, handleEvents, initState, setState, updateState} from '../../utils/stateUtils';
import {LANGUAGE} from '../../config/constants';
import {
  APP_EVENT_CLEAR_KOULUTUSTYYPPI_SECTION,
  APP_STATE_KOULUTUS_DETAILS,
  APP_STATE_KOULUTUSKOODI_LIST
} from '../../config/states';
import {urlRelaatioAlakoodit} from '../../config/urls';
import {getKoulutusOptionById} from './KoulutuskoodiListStore';

export const KoulutusDetailsStore = () => {
  handleEvents({
    [APP_EVENT_CLEAR_KOULUTUSTYYPPI_SECTION]: () => clearKoulutusDetails()
  });
  initKoulutusDetails();
}

const loadKoulutusDetails = (koulutusId) => {
  const koulutusOption = getKoulutusOptionById(koulutusId);
  updateKoulutusDetails({
    ...koulutusOption,
    enabled: false,
    koodiUri: koulutusOption.koodiUri,
    versio: koulutusOption.versio
  });
  axios.get(urlRelaatioAlakoodit(koulutusOption.koodiUri, koulutusOption.versio))
  .then((response) => setKoulutusDetailsData(response.data));
}

const setKoulutusDetailsData = (alakoodiJsonArray) => {
  const alakoodiList = AlakoodiList.createFromJsonArray(alakoodiJsonArray);
  updateKoulutusDetails({
    koulutusala: AlakoodiList.findKoulutusala(alakoodiList, LANGUAGE),
    osaamisalaNameList: AlakoodiList.findOsaamisalaNameList(alakoodiList, LANGUAGE),
    osaamisalaOptions: createOsaamisalaOptions(alakoodiList),
    tutkintonimikeList: AlakoodiList.findTutkintonimikeList(alakoodiList, LANGUAGE),
    opintojenLaajuus: AlakoodiList.findOpintojenLaajuus(alakoodiList, LANGUAGE),
    opintojenLaajuusyksikko: AlakoodiList.findOpintojenLaajuusyksikko(alakoodiList, LANGUAGE),
    enabled: true
  });
}

const initKoulutusDetails = () => initState(APP_STATE_KOULUTUS_DETAILS, {
  enabled: false
});

const updateKoulutusDetails = (stateUpdate) => updateState(APP_STATE_KOULUTUS_DETAILS, stateUpdate);

const createOsaamisalaOptions = (alakoodiList) => AlakoodiList.findOsaamisalaList(alakoodiList).map(listentry => ({
  label: AlakoodiItem.findName(listentry, LANGUAGE),
  value: listentry.koodiUri
}));

export const clearKoulutusDetails = () => setState(APP_STATE_KOULUTUS_DETAILS, {
  enabled: false
});

export const getKoodiUri = () => getState(APP_STATE_KOULUTUS_DETAILS, 'koodiUri');

export const getVersio = () => getState(APP_STATE_KOULUTUS_DETAILS, 'versio');

export const updateKoulutuksenNimi = (nimi) => updateState(APP_STATE_KOULUTUS_DETAILS, {nimi});
export const getKoulutuksenNimi = () => getState(APP_STATE_KOULUTUS_DETAILS, 'nimi');

export const getActiveKoulutusById = (activeKoulutusId) => {
  const koulutusMap = getState(APP_STATE_KOULUTUSKOODI_LIST, 'koulutusMap');
  return koulutusMap[activeKoulutusId];
}

export const deselectKoulutus = () => clearValues(APP_STATE_KOULUTUS_DETAILS);

export const selectKoulutus = (activeKoulutusId) => loadKoulutusDetails(activeKoulutusId);

export const getNameTranslationMap = () => getState(APP_STATE_KOULUTUS_DETAILS, 'nameTranslationMap') || {};
