import axios from 'axios';
import {AlakoodiList} from '../model/Alakoodi';
import {clearState, clearValues, getState, updateState} from '../utils/stateUtils';
import {LANGUAGE} from '../config/constants';
import {APP_STATE_ACTIVE_KOULUTUS, APP_STATE_KOULUTUS_DETAILS, APP_STATE_WORKFLOW} from '../config/states';
import {urlKoulutuksenKuvaus, urlRelaatioAlakoodit} from '../config/urls';
import {extractKoodiUri, extractNimi, extractVersio} from '../model/Koulutuskoodi';
import {extractKoulutuksenKuvaus} from '../model/KoulutuksenKuvaus';
import {connectToOne} from '../utils/stateUtils';

export const KoulutusDetailsStore = () => {
  connectToOne(APP_STATE_WORKFLOW, {}, () => {
    clearState(APP_STATE_KOULUTUS_DETAILS);
  });
  connectToOne(APP_STATE_ACTIVE_KOULUTUS, {}, (koulutus) => {
    if (!koulutus.activeKoulutus) {
      return clearKoulutusDetails();
    }
    loadKoulutusDetails(koulutus.activeKoulutus);
    loadKoulutuksenKuvaus(koulutus.activeKoulutus);
  });
}

const loadKoulutusDetails = (koulutuskoodi) => {
  const koodiUri = extractKoodiUri(koulutuskoodi);
  const versio = extractVersio(koulutuskoodi);
  updateState(APP_STATE_KOULUTUS_DETAILS, {
    active: false,
    koodiUri: koodiUri,
    versio: versio,
    nimi: extractNimi(koulutuskoodi)
  });
  axios.get(urlRelaatioAlakoodit(koodiUri, versio)).then((response) => setKoulutusDetailsData(response.data));
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

const loadKoulutuksenKuvaus = (koulutuskoodi) =>
    axios.get(urlKoulutuksenKuvaus(extractKoodiUri(koulutuskoodi))).then((response) => setKoulutuksenKuvausData(response.data));

const setKoulutuksenKuvausData = (jsonData) => updateState(APP_STATE_KOULUTUS_DETAILS, {
  kuvaus: extractKoulutuksenKuvaus(jsonData)
});


