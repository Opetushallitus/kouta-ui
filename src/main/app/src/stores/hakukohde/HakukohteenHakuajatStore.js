import {initState, setState} from '../../utils/stateUtils';

export const APP_STATE_HAKUKOHTEEN_HAKUAJAT = 'APP_STATE_HAKUKOHTEEN_HAKUAJAT';

export const HakukohteenHakuajatStore = () => initState(APP_STATE_HAKUKOHTEEN_HAKUAJAT, getInitialState());

export const clearSelections = () => setState(APP_STATE_HAKUKOHTEEN_HAKUAJAT, getInitialState());

const getInitialState = () => ({});
