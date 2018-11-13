import {clearState, getState, handleEvents, initState, setStates, updateState} from '../../utils/stateUtils';
import {
  EVENT_SELECTION_CHANGE,
  EVENT_SELECTION_CLEAR,
  STATE_OPTIONS,
  STATE_SELECTIONS,
  STATE_SUPPORTED_LANGUAGES
} from '../../config/scopes/Kieliversio';
import {LANGUAGE} from '../../config/constants';

export const KieliversioStore = (scope) => {
  handleEvents({
    [scope[EVENT_SELECTION_CHANGE]]: (selection) => selectKieliversio(scope, selection.value, selection.selected),
    [scope[EVENT_SELECTION_CLEAR]]: () => clearKieliversioSelections(scope)
  });
  initState(scope[STATE_OPTIONS], getKieliversioOptions());
  selectKieliversio(scope, 'fi', true);
};

const getKieliversioOptions = () => [
  {
    key: 'fi',
    label: 'Suomi'
  },
  {
    key: 'sv',
    label: 'Ruotsi'
  },
  {
    key: 'en',
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

const dreamStateUpdate = (scope, kieliversioId, selected) => {
  const state = getState(scope[STATE_SELECTIONS]);
  state[kieliversioId] = selected;
  return state;
};

const hasDreamedStateAnyLanguagesSelected = (dreamedState) => extractSelectedLanguages(dreamedState).length > 0;

const selectKieliversio = (scope, kieliversioId, selected) => {
  const dreamedState = dreamStateUpdate(scope, kieliversioId, selected);
  hasDreamedStateAnyLanguagesSelected(dreamedState) && setStates({
    [scope[STATE_SELECTIONS]]: dreamedState,
    [scope[STATE_SUPPORTED_LANGUAGES]]: extractSelectedLanguages(dreamedState)
  });
};

const clearKieliversioSelections = (scope) => {
  clearState(scope[STATE_SELECTIONS]);
  const selectionState = updateState(scope[STATE_SELECTIONS], {
    [LANGUAGE.toLowerCase()]: true
  });
  const supportedLanguages = extractSelectedLanguages(selectionState);
  updateState(scope[STATE_SUPPORTED_LANGUAGES], supportedLanguages);
};

export const getSupportedLanguagesInScope = (scope) => getState(scope[STATE_SUPPORTED_LANGUAGES]) || [];
