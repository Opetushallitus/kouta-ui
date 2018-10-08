import {action, observable, computed} from 'mobx';
import axios from 'axios';
import {getId, getSelectedOptions, Koulutuskoodi} from '../model/Koulutuskoodi';
import {loadKoulutusDetails} from './KoulutusDetailsStore';
import {getActiveKoulutusById, getConsecutiveSectionName, setKoulutusMap, setKoulutusOptions} from '../model/KoulutuksenJulkaiseminen';
import {LuoKoulutusSection} from '../views/koulutus-publication/section/LuoKoulutusSection';
import {APP_STATE_ACTIVE_KOULUTUS, APP_STATE_SECTION_EXPANSION_MAP} from '../config/states';
import {observe, updateState} from '../utils/utils';
import {urlKoulutuskoodit} from '../config/urls';

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
    koodiList.forEach((koulutuskoodi) => {
        let id = getId(koulutuskoodi);
        koulutusMap[id] = koulutuskoodi;
        let options = getSelectedOptions(koulutuskoodi);

        selectionOptions = selectionOptions.concat(options);
    });
    this.koulutusMap = koulutusMap;
    this.koulutusOptions = selectionOptions;
    setKoulutusMap(this.koulutusMap);
    setKoulutusOptions(this.koulutusOptions);
  }

  findKoulutusList = () => {
    const url = urlKoulutuskoodit();
    return axios.get(url).then((response) => this.setKoodisto(response.data));
  }

  @action
  selectKoulutustyyppi = (value) => {
    this.setKoulutustyyppi(value);
    this.findKoulutusList();
  };


  @action
  setSectionExpansion = (sectionName, expanded) => {
    const expansionMap = { ...this.sectionExpansionMap };
    expansionMap[sectionName] = expanded;
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
};


const koulutusMap = {};

observe(APP_STATE_SECTION_EXPANSION_MAP, {
  LuoKoulutusSection: true,
  activeSection: 'LuoKoulutusSection'
});

export const selectKoulutus = (activeKoulutusId) => {
  const activeKoulutus = getActiveKoulutusById(activeKoulutusId);
  updateState(APP_STATE_ACTIVE_KOULUTUS, {
    activeKoulutusId,
    activeKoulutus
  });
};


let appStore = null;

export const getAppStore = () => {
  if (!appStore) {
    appStore = new AppStore();
  }
  return appStore;
};
