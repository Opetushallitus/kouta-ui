import {AlakoodiList} from '../model/Alakoodi';
import axios from 'axios';
import {updateState} from '../utils/utils';
import {getLanguage} from '../config/configuration';
import {APP_STATE_KOULUTUS_DETAILS} from '../config/constants';

export const loadKoulutusDetails = (koulutuskoodi) => {
  const koodiUri = koulutuskoodi.getKoodiUri();
  const versio = koulutuskoodi.getVersio();
  updateState(APP_STATE_KOULUTUS_DETAILS, {
    active: false,
    koodiUri: koodiUri,
    versio: versio,
    nimi: koulutuskoodi.getNimi()
  });

  axios.get(`https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/relaatio/sisaltyy-alakoodit/${koodiUri}?koodiVersio=${versio}`)
  .then((response) => setData(response.data));
}

const setData = (alakoodiJsonArray) => {
  const alakoodiList = AlakoodiList.createFromJsonArray(alakoodiJsonArray);
  const language = getLanguage();
  updateState(APP_STATE_KOULUTUS_DETAILS, {
    osaamisalaList: AlakoodiList.findOsaamisalaList(alakoodiList, language),
    koulutusala: AlakoodiList.findKoulutusala(alakoodiList, language),
    opintojenLaajuus: AlakoodiList.findOpintojenLaajuus(alakoodiList, language),
    opintojenLaajuusyksikko: AlakoodiList.findOpintojenLaajuusyksikko(alakoodiList, language),
    active: true
  });
}