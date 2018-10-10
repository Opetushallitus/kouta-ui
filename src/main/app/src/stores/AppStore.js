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
