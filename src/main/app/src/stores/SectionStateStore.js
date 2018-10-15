import {APP_STATE_SECTION_EXPANSION_MAP} from '../config/states';
import {observe, updateState} from '../utils/utils';
import {logEvent} from '../utils/logging';

export const SectionStateStore = () => observe(APP_STATE_SECTION_EXPANSION_MAP, {
  LuoKoulutusSection: true,
  activeSection: 'LuoKoulutusSection'
});


const consecutiveSections = [
  'LuoKoulutusSection',
  'KoulutustyyppiSection',
  'KoulutuksenTiedotSection',
  'KoulutuksenKuvausSection',
  'ValitseOrganisaatioSection'
];


export const setSectionExpansion = (sectionName, expanded) => {
  logEvent('SectionStateStore:setSectionExpansion:sectionName');
  logEvent(sectionName);
  const updatedState = updateState(APP_STATE_SECTION_EXPANSION_MAP, {
    [sectionName]: expanded,
    activeSection: sectionName
  });
  logEvent('SectionStateStore:setSectionExpansion:sectionName:updatedState');
  logEvent(updatedState);
};


export const setSectionDone = (sectionName) => {
  const consecutiveSection = getConsecutiveSectionName(sectionName);
  if (!consecutiveSection) {
    return;
  }
  setSectionExpansion(consecutiveSection, true);
};


const getConsecutiveSectionName = (sectionName) => {
  const index = consecutiveSections.indexOf(sectionName);
  const nextIndex = index + 1;
  if (nextIndex > (consecutiveSections.length - 1)) {
    return null;
  }
  return consecutiveSections[nextIndex];
}