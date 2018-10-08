import axios from 'axios';
import {AlakoodiList} from '../model/Alakoodi';
import {connect, updateState} from '../utils/utils';
import {LANGUAGE} from '../config/constants';
import {APP_STATE_ACTIVE_KOULUTUS, APP_STATE_KOULUTUS_DETAILS} from '../config/states';
import {urlRelaatioAlakoodit} from '../config/urls';
import {getKoodiUri, getNimi, getVersio} from '../model/Koulutuskoodi';


connect(APP_STATE_ACTIVE_KOULUTUS, {}, (koulutus) => loadKoulutusDetails(koulutus.activeKoulutus));

export const loadKoulutusDetails = (koulutuskoodi) => {
  const koodiUri = getKoodiUri(koulutuskoodi);
  const versio = getVersio(koulutuskoodi);
  updateState(APP_STATE_KOULUTUS_DETAILS, {
    active: false,
    koodiUri: koodiUri,
    versio: versio,
    nimi: getNimi(koulutuskoodi)
  });
  axios.get(urlRelaatioAlakoodit(koodiUri, versio))
  .then((response) => setData(response.data));
}

const setData = (alakoodiJsonArray) => {
  const alakoodiList = AlakoodiList.createFromJsonArray(alakoodiJsonArray);
  updateState(APP_STATE_KOULUTUS_DETAILS, {
    osaamisalaList: AlakoodiList.findOsaamisalaList(alakoodiList, LANGUAGE),
    koulutusala: AlakoodiList.findKoulutusala(alakoodiList, LANGUAGE),
    opintojenLaajuus: AlakoodiList.findOpintojenLaajuus(alakoodiList, LANGUAGE),
    opintojenLaajuusyksikko: AlakoodiList.findOpintojenLaajuusyksikko(alakoodiList, LANGUAGE),
    active: true
  });
}