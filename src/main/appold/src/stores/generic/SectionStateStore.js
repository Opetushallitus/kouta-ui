import {getState, initState, updateState} from '../../utils/stateUtils';

export const APP_STATE_SECTION_EXPANSION_MAP = 'APP_STATE_SECTION EXPANSION_MAP';
export const APP_STATE_SECTION_TAB_MAP = 'APP_STATE_SECTION_TAB_MAP';
export const APP_EVENT_SECTION_VALIDATION_REQUEST = 'APP_EVENT_SECTION_VALIDATION_REQUEST';

const INTERNAL_STATE_SECTION_TO_SEQUENCE_MAP = 'INTERNAL_STATE_SECTION_TO_SEQUENCE_MAP';
const INTERNAL_STATE_SEQUENCE_TO_SECTION_MAP = 'INTERNAL_STATE_SEQUENCE_TO_SECTION_MAP';

export const SectionStateStore = () => initState(APP_STATE_SECTION_EXPANSION_MAP, {
  KoulutustyyppiSection: true,
  activeSection: 'KoulutuksenTyyppiSection'
});

export const setSectionExpansion = (sectionName, expanded) => updateState(APP_STATE_SECTION_EXPANSION_MAP, {
  [sectionName]: expanded,
  activeSection: sectionName
});

export const setActiveTab = (sectionName, activeTab) => updateState(APP_STATE_SECTION_TAB_MAP, {
  [sectionName]: activeTab
});

export const setSectionDone = (sectionName) => {
  const consecutiveSection = getConsecutiveSectionName(sectionName);
  consecutiveSection && setSectionExpansion(consecutiveSection, true);
};

export const selectTab = (sectionName, tabId) => updateState(APP_STATE_SECTION_TAB_MAP, {
  [sectionName]: tabId
});

export const registerSection = (sectionName) => {
  const sequence = getNextSequence();
  updateState(INTERNAL_STATE_SECTION_TO_SEQUENCE_MAP, {
    [sectionName]: sequence
  });
  updateState(INTERNAL_STATE_SEQUENCE_TO_SECTION_MAP, {
    [sequence]: sectionName
  });
}

const getSequenceToSectionMap = () => getState(INTERNAL_STATE_SEQUENCE_TO_SECTION_MAP) || {};

const getSectionToSequenceMap = () => getState(INTERNAL_STATE_SECTION_TO_SEQUENCE_MAP) || {};

const getNextSequence = () => Object.keys(getSequenceToSectionMap()).length + 1;

const getSequenceBySection = (sectionName) => {
  const map = getSectionToSequenceMap();
  return map[sectionName];
}

const getSectionBySequence = (sequence) => getSequenceToSectionMap()[sequence];

const getConsecutiveSectionName = (sectionName) => {
  const sequence = getSequenceBySection(sectionName);
  const nextSequence = sequence + 1;
  return getSectionBySequence(nextSequence);
}
