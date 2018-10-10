import {Koulutuskoodi} from '../model/Koulutuskoodi';
import {loadKoulutusDetails} from './KoulutusDetailsStore';
import {getActiveKoulutusById, getConsecutiveSectionName} from '../model/KoulutuksenJulkaiseminen';
import {LuoKoulutusSection} from '../views/koulutus-publication/section/LuoKoulutusSection';
import {APP_STATE_SECTION_EXPANSION_MAP} from '../config/states';
import {observe, updateState} from '../utils/utils';

export const SectionStateStore = () => observe(APP_STATE_SECTION_EXPANSION_MAP, {
  LuoKoulutusSection: true,
  activeSection: 'LuoKoulutusSection'
});

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

