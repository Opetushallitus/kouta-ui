import {Koulutuskoodi} from './Koulutuskoodi';

const consecutiveSections = [
  'LuoKoulutusSection',
  'KoulutustyyppiSection',
  'KoulutuksenTiedotSection',
  'KoulutuksenKuvausSection',
  'ValitseOrganisaatioSection'
];

export const getConsecutiveSectionName = (sectionName) => {
  const index = consecutiveSections.indexOf(sectionName);
  const nextIndex = index +1 ;
  if (nextIndex > (consecutiveSections.length-1) ) {
    return null;
  }
  return consecutiveSections[nextIndex];
}

let koulutusMap = {};
let koulutusOptions = [];

export const setKoulutusMap = (map) => {
  koulutusMap = map;
};

export const setKoulutusOptions = (list) => {
  koulutusOptions = list;
};

export const getActiveKoulutusById = (activeKoulutusId) => koulutusMap[activeKoulutusId];