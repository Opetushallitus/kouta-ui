import {initState, setState} from '../../utils/stateUtils';

export const APP_STATE_HAKUKOHTEEN_ALOITUSPAIKAT = 'APP_STATE_HAKUKOHTEEN_ALOITUSPAIKAT';

export const HakukohteenAloituspaikatStore = () => initState(APP_STATE_HAKUKOHTEEN_ALOITUSPAIKAT, getInitialState());

export const clearSelections = () => setState(APP_STATE_HAKUKOHTEEN_ALOITUSPAIKAT, getInitialState());

const getInitialState = () => ({});
