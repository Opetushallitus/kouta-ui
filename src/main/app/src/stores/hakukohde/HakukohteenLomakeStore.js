import {initState, setState} from '../../utils/stateUtils';

export const APP_STATE_HAKUKOHTEEN_LOMAKE = 'APP_STATE_HAKUKOHTEEN_LOMAKE';

export const HakukohteenLomakeStore = () => initState(APP_STATE_HAKUKOHTEEN_LOMAKE, getInitialState());

export const clearSelections = () => setState(APP_STATE_HAKUKOHTEEN_LOMAKE, getInitialState());

const getInitialState = () => ({});
