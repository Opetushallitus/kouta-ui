import {initState, setState} from '../../utils/stateUtils';

export const APP_STATE_HAKUKOHTEEN_ALKAMISKAUSI = 'APP_STATE_HAKUKOHTEEN_ALKAMISKAUSI';

export const HakukohteenAlkamiskausiStore = () => initState(APP_STATE_HAKUKOHTEEN_ALKAMISKAUSI, getInitialState());

export const clearSelections = () => setState(APP_STATE_HAKUKOHTEEN_ALKAMISKAUSI, getInitialState());

const getInitialState = () => ({});


