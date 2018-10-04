import {observable, action} from 'mobx';
import {AlakoodiList} from '../model/Alakoodi';
import axios from 'axios';

class KoulutusDetailsStore {

  language = 'FI';

  @observable active = false;
  @observable osaamisalaList = null;
  @observable koulutusala = null;
  @observable opintojenLaajuus = null;
  @observable opintojenLaajuusyksikko = null;

  configure = (koodiUri, versio) => {
    this.setActive(false);
    axios.get(`https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/relaatio/sisaltyy-alakoodit/${koodiUri}?koodiVersio=${versio}`)
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