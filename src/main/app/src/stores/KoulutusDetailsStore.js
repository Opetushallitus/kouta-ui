import {observable, action} from 'mobx';
import {AlakoodiList} from '../model/Alakoodi';
import axios from 'axios';

class KoulutusDetailsStore {

  language = 'FI';

  @observable active = false;

  osaamisalaList = null;
  koulutusala = null;
  opintojenLaajuus = null;
  opintojenLaajuusyksikko = null;
  nimi = null;
  koodiUri = null;
  versio = null;

  configure = (koulutuskoodi) => {
    this.setActive(false);
    this.koodiUri = koulutuskoodi.getKoodiUri();
    this.versio = koulutuskoodi.getVersio();
    this.nimi = koulutuskoodi.getNimi();
    axios.get(`https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/relaatio/sisaltyy-alakoodit/${this.koodiUri}?koodiVersio=${this.versio}`)
    .then((response) => this.setData(response.data));
  }

  @action
  setActive = (active) => this.active = active;

  @action
  setData = (alakoodiJsonArray) => {
    const alakoodiList = AlakoodiList.createFromJsonArray(alakoodiJsonArray);
    this.osaamisalaList = AlakoodiList.findOsaamisalaList(alakoodiList, this.language);
    this.koulutusala = AlakoodiList.findKoulutusala(alakoodiList, this.language);
    this.opintojenLaajuus = AlakoodiList.findOpintojenLaajuus(alakoodiList, this.language);
    this.opintojenLaajuusyksikko = AlakoodiList.findOpintojenLaajuusyksikko(alakoodiList, this.language);
    this.active = true;
  }

}

let koulutusDetailsStore;

export const getKoulutusDetailsStore = () => {
  if (!koulutusDetailsStore) {
    koulutusDetailsStore = new KoulutusDetailsStore();
  }
  return koulutusDetailsStore;
};