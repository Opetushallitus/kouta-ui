import {clearState, getState, handleEvents, setState, updateState} from '../../utils/stateUtils';
import {
  EVENT_SELECTION_CHANGE,
  EVENT_SELECTION_CLEAR,
  STATE_OPTIONS,
  STATE_SELECTIONS,
  STATE_SUPPORTED_LANGUAGES
} from '../../config/scopes/Kieliversio';

export const KieliversioStore = (scope) => {
  handleEvents({
    [scope[EVENT_SELECTION_CHANGE]]: (selection) => selectKieliversio(scope, selection.value, selection.selected),
    [scope[EVENT_SELECTION_CLEAR]]: () => clearKieliversioSelections(scope)
  });
  setState(scope[STATE_OPTIONS], getKieliversioOptions());
  selectKieliversio(scope, 'fi', true);
};

const getKieliversioOptions = () => [
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

const sortLanguageCodesByPreferredOrder = (langCodes) => {
  const languagePreferredOrder = {'fi': 1, 'sv': 2, 'en': 3};
  const comparator = (a, b) => languagePreferredOrder[a] - languagePreferredOrder[b];
  const results = langCodes.sort(comparator);
  return results;
};

const extractSelectedLanguages = (languageSelectionMap) => sortLanguageCodesByPreferredOrder(Object.keys(languageSelectionMap))
  .filter(languageKey => languageSelectionMap[languageKey] === true);

const selectKieliversio = (scope, kieliversioId, selected) => {
  const selections = updateState(scope[STATE_SELECTIONS], {
    [kieliversioId]: selected
  });
  const selectedLanguages = extractSelectedLanguages(selections);
  updateState(scope[STATE_SUPPORTED_LANGUAGES], selectedLanguages);
};

const clearKieliversioSelections = (scope) => clearState(scope[STATE_SELECTIONS]);

export const getSupportedLanguagesInScope = (scope) => getState(scope[STATE_SUPPORTED_LANGUAGES]) || [];
