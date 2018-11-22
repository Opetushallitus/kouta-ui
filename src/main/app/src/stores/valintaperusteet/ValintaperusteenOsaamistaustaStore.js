import {initState, setState} from '../../utils/stateUtils';

export const APP_STATE_VALINTAPERUSTEEN_OSAAMISTAUSTA = 'APP_STATE_VALINTAPERUSTEEN_OSAAMISTAUSTA';

export const ValintaperusteenOsaamistaustaStore = () => initState(APP_STATE_VALINTAPERUSTEEN_OSAAMISTAUSTA, getInitialState());

export const clearSelections = () => setState(APP_STATE_VALINTAPERUSTEEN_OSAAMISTAUSTA, getInitialState());

const getInitialState = () => ({});
