import axios from 'axios';
import {AlakoodiList} from '../model/Alakoodi';
import {clearState, clearValues, connectToOne, getState, updateState} from '../utils/stateUtils';
import {LANGUAGE} from '../config/constants';
import {APP_STATE_KOULUTUS_DETAILS, APP_STATE_KOULUTUS_LIST, APP_STATE_WORKFLOW} from '../config/states';
import {urlRelaatioAlakoodit} from '../config/urls';
import {getKoulutusOptionById} from './KoulutusListStore';

export const KoulutusDetailsStore = () => connectToOne(APP_STATE_WORKFLOW, {}, () => {
    clearState(APP_STATE_KOULUTUS_DETAILS);
  });

const loadKoulutusDetails = (koulutusId) => {
  const koulutusOption = getKoulutusOptionById(koulutusId);
  updateState(APP_STATE_KOULUTUS_DETAILS, koulutusOption);
  axios.get(urlRelaatioAlakoodit(koulutusOption.koodiUri, koulutusOption.versio))
  .then((response) => setKoulutusDetailsData(response.data));
}

const setKoulutusDetailsData = (alakoodiJsonArray) => {
  const alakoodiList = AlakoodiList.createFromJsonArray(alakoodiJsonArray);

  updateState(APP_STATE_KOULUTUS_DETAILS, {
    koulutusala: AlakoodiList.findKoulutusala(alakoodiList, LANGUAGE),
    osaamisalaList: AlakoodiList.findOsaamisalaList(alakoodiList, LANGUAGE),
    tutkintonimikeList: AlakoodiList.findTutkintonimikeList(alakoodiList, LANGUAGE),
    opintojenLaajuus: AlakoodiList.findOpintojenLaajuus(alakoodiList, LANGUAGE),
    opintojenLaajuusyksikko: AlakoodiList.findOpintojenLaajuusyksikko(alakoodiList, LANGUAGE),
    active: true
  });
}

export const clearKoulutusDetails = () => clearValues(APP_STATE_KOULUTUS_DETAILS);

export const getKoodiUri = () => getState(APP_STATE_KOULUTUS_DETAILS, 'koodiUri');

export const getVersio = () => getState(APP_STATE_KOULUTUS_DETAILS, 'versio');

export const updateKoulutuksenNimi = (nimi) => updateState(APP_STATE_KOULUTUS_DETAILS, {nimi});
export const getKoulutuksenNimi = () => getState(APP_STATE_KOULUTUS_DETAILS, 'nimi');

export const getActiveKoulutusById = (activeKoulutusId) => {
  const koulutusMap = getState(APP_STATE_KOULUTUS_LIST, 'koulutusMap');
  return koulutusMap[activeKoulutusId];
}

export const deselectKoulutus = () => clearValues(APP_STATE_KOULUTUS_DETAILS);

export const selectKoulutus = (activeKoulutusId) => loadKoulutusDetails(activeKoulutusId)

