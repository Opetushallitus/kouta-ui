import {initState, setState} from '../../utils/stateUtils';

export const APP_STATE_VALINTAPERUSTEEN_HAUN_KOHDEJOUKKO = 'APP_STATE_VALINTAPERUSTEEN_HAUN_KOHDEJOUKKO';

export const ValintaperusteenHaunKohdejoukkoStore = () => initState(APP_STATE_VALINTAPERUSTEEN_HAUN_KOHDEJOUKKO, getInitialState());

export const clearSelections = () => setState(APP_STATE_VALINTAPERUSTEEN_HAUN_KOHDEJOUKKO, getInitialState());

const getInitialState = () => ({});
