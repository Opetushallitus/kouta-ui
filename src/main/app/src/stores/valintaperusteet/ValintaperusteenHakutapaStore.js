import {getState, setState, updateState} from '../../utils/stateUtils';
import {updateSingleSelectionOptionActivation} from '../../utils/optionListUtils';

export const APP_STATE_VALINTAPERUSTEEN_HAKUTAPA = 'APP_STATE_VALINTAPERUSTEEN_HAKUTAPA';

export const ValintaperusteenHakutapaStore = () => setState(APP_STATE_VALINTAPERUSTEEN_HAKUTAPA, getInitialState());

export const clearSelections = () => setState(APP_STATE_VALINTAPERUSTEEN_HAKUTAPA, getInitialState());

//TODO: check if there is API for this && implement as API request
const getInitialState = () => ({
  options: [
    {
      key: 'jatkuva-haku-erillishaku',
      label: 'Jatkuva haku / Erillishaku'
    },
    {
      key: 'yhteishaku',
      label: 'Yhteishaku (näkyy vain rekisterin pitäjälle)'
    }
  ]
});

const getOptions = () => getState(APP_STATE_VALINTAPERUSTEEN_HAKUTAPA, 'options');

export const selectOption = (change) => updateState(APP_STATE_VALINTAPERUSTEEN_HAKUTAPA, {
  options: updateSingleSelectionOptionActivation(getOptions(), change)
});
