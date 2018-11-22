import {initState, setState} from '../../utils/stateUtils';

export const APP_STATE_VALINTAPERUSTEEN_VAHIMMAISEHDOT = 'APP_STATE_VALINTAPERUSTEEN_VAHIMMAISEHDOT';

export const ValintaperusteenVahimmaisehdotStore = () => initState(APP_STATE_VALINTAPERUSTEEN_VAHIMMAISEHDOT, getInitialState());

export const clearSelections = () => setState(APP_STATE_VALINTAPERUSTEEN_VAHIMMAISEHDOT, getInitialState());

const getInitialState = () => ({});
