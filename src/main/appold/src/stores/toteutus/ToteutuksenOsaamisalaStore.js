import {clearState, getState, handleEvents, initStates, updateState} from '../../utils/stateUtils';

export const APP_STATE_TOTEUTUKSEN_OSAAMISALA_SELECTIONS = 'APP_STATE_TOTEUTUKSEN_OSAAMISALA_SELECTIONS';
export const APP_STATE_TOTEUTUKSEN_OSAAMISALA_OPTIONS = 'APP_STATE_TOTEUTUKSEN_OSAAMISALA_OPTIONS';
export const APP_EVENT_TOTEUTUKSEN_OSAAMISALA_SELECTION_CHANGE = 'APP_EVENT_TOTEUTUKSEN_OSAAMISALA_SELECTION_CHANGE';
export const APP_EVENT_TOTEUTUKSEN_OSAAMISALA_CLEAR = 'APP_EVENT_TOTEUTUKSEN_OSAAMISALA_CLEAR';

export const ToteutuksenOsaamisalaStore = () => {
  handleEvents({
    [APP_EVENT_TOTEUTUKSEN_OSAAMISALA_SELECTION_CHANGE]: (selection) => selectToteutuksenOsaamisala(selection.value, selection.selected),
    [APP_EVENT_TOTEUTUKSEN_OSAAMISALA_CLEAR]: () => clearToteutuksenOsaamisalaSelections()
  });
  initStates({
    [APP_STATE_TOTEUTUKSEN_OSAAMISALA_SELECTIONS]: {}
  });
};

export const selectToteutuksenOsaamisala = (osaamisalaId, selected) => updateState(APP_STATE_TOTEUTUKSEN_OSAAMISALA_SELECTIONS, {
  [osaamisalaId]: selected
});

export const clearToteutuksenOsaamisalaSelections = () => clearState(APP_STATE_TOTEUTUKSEN_OSAAMISALA_SELECTIONS);

export const getToteutuksenOsaamisalaSelections = () => getState(APP_STATE_TOTEUTUKSEN_OSAAMISALA_SELECTIONS);
