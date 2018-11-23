import {initState, setState} from '../../utils/stateUtils';

export const APP_STATE_VALINTAPERUSTEEN_HAKUTAPA = 'APP_STATE_VALINTAPERUSTEEN_HAKUTAPA';

export const ValintaperusteenHakutapaStore = () => initState(APP_STATE_VALINTAPERUSTEEN_HAKUTAPA, getInitialState());

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
