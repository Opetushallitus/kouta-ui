import {action, observable, computed} from 'mobx';
import axios from 'axios';
import {Koulutuskoodi} from '../model/Koulutuskoodi';
import {getKoulutusDetailsStore, loadKoulutusDetails} from './KoulutusDetailsStore';
import {getConsecutiveSectionName} from '../model/KoulutuksenJulkaiseminen';
import {LuoKoulutusSection} from '../views/koulutus-publication/section/LuoKoulutusSection';
import {APP_STATE_SECTION_EXPANSION_MAP} from '../config/constants';
import {observe, updateState} from '../utils/utils';

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
  @observable activeSection = 'LuoKoulutusSection';

  koulutusMap = null;

  @computed get activeKoulutusId() {
      return this.activeKoulutus ? this.activeKoulutus.id : null;
  }

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
    this.findKoulutusList();
  };


  @action
  selectKoulutus = (koulutusId) => {
    console.log('KoulutusDetailsStore:selectKoulutus:koulutusId', koulutusId);
    this.activeKoulutus = this.koulutusMap[koulutusId];
    loadKoulutusDetails(this.activeKoulutus);
  }

  @action
  setSectionExpansion = (sectionName, expanded) => {
    const expansionMap = { ...this.sectionExpansionMap };
    expansionMap[sectionName] = expanded;
    console.log('AppStore:setSectionExpansion:state', expansionMap);
    this.expansionMap  =  expansionMap;
  }
}

export const setSectionExpansion = (sectionName, expanded) => updateState(APP_STATE_SECTION_EXPANSION_MAP, {
  [sectionName]: expanded,
  activeSection: sectionName
});

export const setSectionDone = (sectionName) => {
  const consecutiveSection = getConsecutiveSectionName(sectionName);
  if (!consecutiveSection) {
    return;
  }
  setSectionExpansion(consecutiveSection, true);
}

observe(APP_STATE_SECTION_EXPANSION_MAP, {
  LuoKoulutusSection: true,
  activeSection: 'LuoKoulutusSection'
});

let appStore = null;

export const getAppStore = () => {
  if (!appStore) {
    appStore = new AppStore();
  }
  return appStore;
};
