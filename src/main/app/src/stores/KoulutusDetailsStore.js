import axios from 'axios';
import {AlakoodiList} from '../model/Alakoodi';
import {connect, updateState} from '../utils/utils';
import {LANGUAGE} from '../config/constants';
import {APP_STATE_ACTIVE_KOULUTUS, APP_STATE_KOULUTUS_DETAILS} from '../config/states';
import {urlKoulutuksenKuvaus, urlOrganisaatiot, urlRelaatioAlakoodit} from '../config/urls';
import {extractKoodiUri, getNimi, getVersio} from '../model/Koulutuskoodi';
import {extractKoulutuksenKuvaus} from '../model/KoulutuksenKuvaus';

export const KoulutusDetailsStore = () => connect(APP_STATE_ACTIVE_KOULUTUS, {}, (koulutus) => {
  loadKoulutusDetails(koulutus.activeKoulutus);
  loadKoulutuksenKuvaus(koulutus.activeKoulutus);
});

const loadKoulutusDetails = (koulutuskoodi) => {
  const koodiUri = extractKoodiUri(koulutuskoodi);
  const versio = getVersio(koulutuskoodi);
  updateState(APP_STATE_KOULUTUS_DETAILS, {
    active: false,
    koodiUri: koodiUri,
    versio: versio,
    nimi: getNimi(koulutuskoodi)
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

const loadKoulutuksenKuvaus = (koulutuskoodi) =>
    axios.get(urlKoulutuksenKuvaus(extractKoodiUri(koulutuskoodi))).then((response) => setKoulutuksenKuvausData(response.data));

const setKoulutuksenKuvausData = (jsonData) => updateState(APP_STATE_KOULUTUS_DETAILS, {
  kuvaus: extractKoulutuksenKuvaus(jsonData)
});

