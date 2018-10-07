import {AlakoodiList} from '../model/Alakoodi';
import axios from 'axios';
import {updateState} from '../utils/utils';
import {LANGUAGE} from '../config/constants';
import {APP_STATE_KOULUTUS_DETAILS} from '../config/states';
import {urlRelaatioAlakoodit} from '../config/urls';

export const loadKoulutusDetails = (koulutuskoodi) => {
  const koodiUri = koulutuskoodi.getKoodiUri();
  const versio = koulutuskoodi.getVersio();
  updateState(APP_STATE_KOULUTUS_DETAILS, {
    active: false,
    koodiUri: koodiUri,
    versio: versio,
    nimi: koulutuskoodi.getNimi()
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