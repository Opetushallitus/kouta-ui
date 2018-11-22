import {initState, setState} from '../../utils/stateUtils';

export const APP_STATE_HAKUKOHTEEN_TARVITTAVAT_LIITTEET = 'APP_STATE_HAKUKOHTEEN_TARVITTAVAT_LIITTEET';

export const HakukohteenTarvittavatLiitteetStore = () => initState(APP_STATE_HAKUKOHTEEN_TARVITTAVAT_LIITTEET, getInitialState());

export const clearSelections = () => setState(APP_STATE_HAKUKOHTEEN_TARVITTAVAT_LIITTEET, getInitialState());

const getInitialState = () => ({});
