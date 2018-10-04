const consecutiveSections = [
  'LuoKoulutusSection',
  'KoulutustyyppiSection',
  'KoulutuksenTiedotSection',
  'KoulutuksenKuvausSection',
  'ValitseOrganisaatioSection'

]

export const getConsecutiveSectionName = (sectionName) => {
  const index = consecutiveSections.indexOf(sectionName);
  const nextIndex = index +1 ;
  if (nextIndex > (consecutiveSections.length-1) ) {
    return null;
  }
  return consecutiveSections[nextIndex];
}