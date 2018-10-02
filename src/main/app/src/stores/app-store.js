import { observable, action } from 'mobx';
import axios from 'axios';
import {Koulutuskoodi} from '../model/Koulutuskoodi';

class AppStore {
  @observable koulutustyyppiOptions = [
    {
      value: 'ammatillinen-koulutus',
      label: 'Ammatillinen koulutus'
    },
    {
      value: 'korkeakoulukoulutus',
      label: 'Korkeakoulukoulutus'
    },
    {
      value: 'lukiokoulutus',
      label: 'Lukiokoulutus'
    }
  ];

  @observable language = 'FI';

  @observable koulutustyyppiSectionExpanded = false;
  @observable koulutuksenTiedotSectionExpanded = false;
  @observable koulutustyyppi = null;
  @observable koulutusOptions = null;
  @observable activeKoulutus = null;

  koulutusMap = null;
  @action
  setKoulutustyyppiSectionExpanded = (value) => this.koulutustyyppiSectionExpanded = value;

  @action
  setKoulutuksenTiedotSectionExpanded = (value) => this.koulutuksenTiedotSectionExpanded = value;

  @action
  setKoulutustyyppi = (koulutustyyppi) => this.koulutustyyppi = koulutustyyppi;

  @action
  setKoodisto = (koodiList) => {
    const koulutusMap = {};
    const koodiSelectionList = [];
    let koulutuskoodi;
    let selectionOptions = [];
    koodiList.forEach((entry) => {
        koulutuskoodi = new Koulutuskoodi(entry, this.language);
        koulutusMap[koulutuskoodi.getId()] = koulutuskoodi;
        selectionOptions = selectionOptions.concat(koulutuskoodi.getSelectionOptions());
    });
    this.koulutusMap = koulutusMap;
    this.koulutusOptions = selectionOptions;
  }

  findKoulutusList = () =>
      axios.get(`https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/koulutus/koodi?onlyValidKoodis=true`)
    .then((response) => this.setKoodisto(response.data));

  @action
  selectKoulutustyyppi = (value) => {
    this.setKoulutustyyppi(value);
    this.setKoulutuksenTiedotSectionExpanded(true);
    this.findKoulutusList();
  };

  @action
  selectKoulutus = (koulutusId) => {
    this.activeKoulutus = this.koulutusMap[koulutusId];
    this.findAlakoodiList(this.activeKoulutus.getKoodiUri(), this.activeKoulutus.getVersio());
  }

  findAlakoodiList = (koodiUri, versio) =>
      axios.get(`https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/relaatio/sisaltyy-alakoodit/${koodiUri}?koodiVersio=${versio}`)
      .then((response) => this.setAlakoodiList(response.data));

  @action
  setAlakoodiList = (alakoodiList) => this.activeKoulutus = this.activeKoulutus.configureKoulutusDetails(alakoodiList);

}
export default AppStore;