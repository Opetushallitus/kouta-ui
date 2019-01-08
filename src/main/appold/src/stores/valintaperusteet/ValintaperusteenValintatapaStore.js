import {initState, setState} from '../../utils/stateUtils';

export const APP_STATE_VALINTAPERUSTEEN_VALINTATAPA = 'APP_STATE_VALINTAPERUSTEEN_VALINTATAPA';

export const ValintaperusteenValintatapaStore = () => initState(APP_STATE_VALINTAPERUSTEEN_VALINTATAPA, getInitialState());

export const clearSelections = () => setState(APP_STATE_VALINTAPERUSTEEN_VALINTATAPA, getInitialState());

const getInitialState = () => ({});
