import {initState, setState} from '../../utils/stateUtils';

export const APP_STATE_VALINTAPERUSTEEN_HAKUTAPA = 'APP_STATE_VALINTAPERUSTEEN_HAKUTAPA';

export const ValintaperusteenHakutapaStore = () => initState(APP_STATE_VALINTAPERUSTEEN_HAKUTAPA, getInitialState());

export const clearSelections = () => setState(APP_STATE_VALINTAPERUSTEEN_HAKUTAPA, getInitialState());

const getInitialState = () => ({});
