import {
  APP_EVENT_KIELIVERSIO_SELECTION_CHANGE, APP_EVENT_KIELIVERSIO_SELECTION_CLEAR, APP_STATE_KIELIVERSIO_OPTIONS,
  APP_STATE_KIELIVERSIO_SELECTIONS
} from '../config/states';
import {clearState, connectToOne, getState, setState, updateState} from '../utils/stateUtils';

export const KieliversioStore = () => {
  setState(APP_STATE_KIELIVERSIO_OPTIONS, [
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
  setState(APP_STATE_KIELIVERSIO_SELECTIONS, {
    'fi': true
  });
  connectToOne(APP_EVENT_KIELIVERSIO_SELECTION_CHANGE, {}, (selection) => selectKieliversio(selection.value, selection.selected));
  connectToOne(APP_EVENT_KIELIVERSIO_SELECTION_CLEAR, {}, () => clearKieliversioSelections());
}

export const selectKieliversio = (kieliversioId, selected) => updateState(APP_STATE_KIELIVERSIO_SELECTIONS, {
  [kieliversioId]: selected
});

export const clearKieliversioSelections = () => clearState(APP_STATE_KIELIVERSIO_SELECTIONS);

const getKieliversioSelections = () => getState(APP_STATE_KIELIVERSIO_SELECTIONS);

export const getSelectedKieliversioIdList = () => {
  const kieliversioSelections = getKieliversioSelections();
  return Object.keys(kieliversioSelections).reduce((selectedIds, kieliversioId) => {
    kieliversioSelections[kieliversioId] && selectedIds.push(kieliversioId);
    return selectedIds;
  }, []);
}

