import {observable, action} from 'mobx';
import {AlakoodiList} from '../model/Alakoodi';
import axios from 'axios';

class KoulutusItemStore {

  language = 'FI';

  @observable osaamisalaList = null;
  @observable koulutusala = null;
  @observable opintojenLaajuus = null;
  @observable opintojenLaajuusyksikko = null;

  configure = (koodiUri, versio) =>
      axios.get(`https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/relaatio/sisaltyy-alakoodit/${koodiUri}?koodiVersio=${versio}`)
      .then((response) => this.setData(response.data));

  @action
  setData = (alakoodiJsonArray) => {
    const alakoodiList = AlakoodiList.createFromJsonArray(alakoodiJsonArray);
    this.osaamisalaList = AlakoodiList.findOsaamisalaList(alakoodiList, this.language);
    this.koulutusala = AlakoodiList.findKoulutusala(alakoodiList, this.language);
    this.opintojenLaajuus = AlakoodiList.findOpintojenLaajuus(alakoodiList, this.language);
    this.opintojenLaajuusyksikko = AlakoodiList.findOpintojenLaajuusyksikko(alakoodiList, this.language);
  }

}

let koulutusItemStore;

export const getKoulutusItemStore = () => {
  if (!koulutusItemStore) {
    koulutusItemStore = new KoulutusItemStore();
  }
  return koulutusItemStore;
};