import {Koulutuskoodi} from './Koulutuskoodi';
import {LANGUAGE} from '../config/constants';

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

export const setKoulutusMap = (map) => koulutusMap = map;

export const setKoulutusOptions = (list) => koulutusOptions = list;

export const getActiveKoulutusById = (activeKoulutusId) => koulutusMap[activeKoulutusId];

export const getKoulutuksenKuvaus = (koulutuksenKuvaus) =>
    ((k) => k.data || [])(koulutuksenKuvaus)
    .slice(0, 1)
    .map((entry) => entry.kuvaus && entry.kuvaus[LANGUAGE.toLowerCase()]).join('');
