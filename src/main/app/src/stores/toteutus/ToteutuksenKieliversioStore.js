import {
  APP_EVENT_TOTEUTUKSEN_KIELIVERSIO_SELECTION_CHANGE,
  APP_EVENT_TOTEUTUKSEN_KIELIVERSIO_SELECTION_CLEAR,
  APP_STATE_TOTEUTUKSEN_KIELIVERSIO_OPTIONS,
  APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SELECTIONS,
  APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES
} from '../../config/states';
import {clearState, connectToOne, getState, setState, updateState} from '../../utils/stateUtils';
import {
  convertKieliversioSelectionsToIdList, extractSelectedLanguages,
  getKieliversioOptions
} from '../generic/KieliversioStore';

export const ToteutuksenKieliversioStore = () => {
  setState(APP_STATE_TOTEUTUKSEN_KIELIVERSIO_OPTIONS, getKieliversioOptions());
  connectToOne(APP_EVENT_TOTEUTUKSEN_KIELIVERSIO_SELECTION_CHANGE, {}, (selection) => selectKieliversio(selection.value, selection.selected));
  connectToOne(APP_EVENT_TOTEUTUKSEN_KIELIVERSIO_SELECTION_CLEAR, {}, () => clearKieliversioSelections());
  selectKieliversio('fi', true);
}

export const selectKieliversio = (kieliversioId, selected) => {
  const selections = updateState(APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SELECTIONS, {
    [kieliversioId]: selected
  });
  const selectedLanguages = extractSelectedLanguages(selections);
  updateState(APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES, selectedLanguages);
}

export const clearKieliversioSelections = () => clearState(APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SELECTIONS);

const getKieliversioSelections = () => getState(APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SELECTIONS);

export const getSelectedKieliversioIdList = () => convertKieliversioSelectionsToIdList(getKieliversioSelections());

export const getSupportedLanguages = () => getState(APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES) || [];
