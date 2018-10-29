export const getKieliversioOptions = () => [
  {
    value: 'fi',
    label: 'Suomi'
  },
  {
    value: 'sv',
    label: 'Ruotsi'
  },
  {
    value: 'en',
    label: 'Englanti'
  }
];

export const convertKieliversioSelectionsToIdList = (kieliversioSelections) => Object.keys(kieliversioSelections).reduce((selectedIds, kieliversioId) => {
  kieliversioSelections[kieliversioId] && selectedIds.push(kieliversioId);
  return selectedIds;
}, []);

export const sortLanguageCodesByPreferredOrder = (langCodes) => {
  const languagePreferredOrder = {'fi': 1, 'sv': 2, 'en': 3};
  const comparator = (a, b) => languagePreferredOrder[a] > languagePreferredOrder[b];
  return langCodes.sort(comparator);
};

export const extractSelectedLanguages = (languageSelectionMap) => sortLanguageCodesByPreferredOrder(Object.keys(languageSelectionMap))
  .filter(languageKey => languageSelectionMap[languageKey] === true);

