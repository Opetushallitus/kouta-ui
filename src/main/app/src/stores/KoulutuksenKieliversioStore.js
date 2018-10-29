import {
  APP_EVENT_KOULUTUKSEN_KIELIVERSIO_SELECTION_CHANGE, APP_EVENT_KOULUTUKSEN_KIELIVERSIO_SELECTION_CLEAR, APP_STATE_KOULUTUKSEN_KIELIVERSIO_OPTIONS,
  APP_STATE_KOULUTUKSEN_KIELIVERSIO_SELECTIONS, APP_STATE_KOULUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES
} from '../config/states';
import {clearState, connectToOne, getState, setState, updateState} from '../utils/stateUtils';

export const KieliversioStore = () => {
  setState(APP_STATE_KOULUTUKSEN_KIELIVERSIO_OPTIONS, [
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
  ]);
  connectToOne(APP_EVENT_KOULUTUKSEN_KIELIVERSIO_SELECTION_CHANGE, {}, (selection) => selectKieliversio(selection.value, selection.selected));
  connectToOne(APP_EVENT_KOULUTUKSEN_KIELIVERSIO_SELECTION_CLEAR, {}, () => clearKieliversioSelections());
  selectKieliversio('fi', true);
}

export const selectKieliversio = (kieliversioId, selected) => {
  const selections = updateState(APP_STATE_KOULUTUKSEN_KIELIVERSIO_SELECTIONS, {
    [kieliversioId]: selected
  });
  const selectedLanguages = extractSelectedLanguages(selections);
  updateState(APP_STATE_KOULUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES, selectedLanguages);
}

export const clearKieliversioSelections = () => clearState(APP_STATE_KOULUTUKSEN_KIELIVERSIO_SELECTIONS);

const getKieliversioSelections = () => getState(APP_STATE_KOULUTUKSEN_KIELIVERSIO_SELECTIONS);

export const getSelectedKieliversioIdList = () => {
  const kieliversioSelections = getKieliversioSelections();
  return Object.keys(kieliversioSelections).reduce((selectedIds, kieliversioId) => {
    kieliversioSelections[kieliversioId] && selectedIds.push(kieliversioId);
    return selectedIds;
  }, []);
}

const sortLanguageCodesByPreferredOrder = (langCodes) => {
  const languagePreferredOrder = {'fi': 1, 'sv': 2, 'en':3 };
  const comparator = (a,b) => languagePreferredOrder[a] > languagePreferredOrder[b];
  return langCodes.sort(comparator);
}

const extractSelectedLanguages = (languageSelectionMap) => sortLanguageCodesByPreferredOrder(Object.keys(languageSelectionMap))
  .filter(languageKey => languageSelectionMap[languageKey] === true);

export const getSupportedLanguages = () => getState(APP_STATE_KOULUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES) || [];
