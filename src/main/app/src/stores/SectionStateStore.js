import {APP_STATE_SECTION_EXPANSION_MAP} from '../config/states';
import {observe, updateState} from '../utils/stateUtils';

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

const getConsecutiveSectionName = (sectionName) => {
  const index = consecutiveSections.indexOf(sectionName);
  const nextIndex = index + 1;
  if (nextIndex > (consecutiveSections.length - 1)) {
    return null;
  }
  return consecutiveSections[nextIndex];
}