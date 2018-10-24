import axios from 'axios';
import {AlakoodiList} from '../model/Alakoodi';
import {clearValues, connectToMany, connectToOne, getState, setState, updateState} from '../utils/stateUtils';
import {LANGUAGE} from '../config/constants';
import {
  APP_EVENT_CLEAR_KOULUTUSTYYPPI_SECTION,
  APP_STATE_ACTIVE_KOULUTUSTYYPPI_CATEGORY,
  APP_STATE_KOULUTUS_DETAILS,
  APP_STATE_KOULUTUSKOODI_LIST,
  APP_STATE_WORKFLOW
} from '../config/states';
import {urlRelaatioAlakoodit} from '../config/urls';
import {getKoulutusOptionById} from './KoulutuskoodiListStore';

export const KoulutusDetailsStore = () => {
  connectToOne(APP_STATE_WORKFLOW, {}, () => clearKoulutusDetails());
  connectToMany([APP_EVENT_CLEAR_KOULUTUSTYYPPI_SECTION, APP_STATE_ACTIVE_KOULUTUSTYYPPI_CATEGORY], {}, () => clearKoulutusDetails());
  setState(APP_STATE_KOULUTUS_DETAILS, {
    enabled: false
  })
}

const loadKoulutusDetails = (koulutusId) => {
  const koulutusOption = getKoulutusOptionById(koulutusId);
  updateState(APP_STATE_KOULUTUS_DETAILS, {...koulutusOption,
    enabled: false,
    koodiUri: koulutusOption.koodiUri,
    versio: koulutusOption.versio
  });
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
    enabled: true
  });
}

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

export const selectKoulutus = (activeKoulutusId) => loadKoulutusDetails(activeKoulutusId)

export const getNameTranslationMap = () => getState(APP_STATE_KOULUTUS_DETAILS, 'nameTranslationMap') || {};
