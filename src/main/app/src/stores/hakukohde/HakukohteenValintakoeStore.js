import {initState, setState} from '../../utils/stateUtils';

export const APP_STATE_HAKUKOHTEEN_VALINTAKOE = 'APP_STATE_HAKUKOHTEEN_VALINTAKOE';

export const HakukohteenValintakoeStore = () => initState(APP_STATE_HAKUKOHTEEN_VALINTAKOE, getInitialState());

export const clearSelections = () => setState(APP_STATE_HAKUKOHTEEN_VALINTAKOE, getInitialState());

const getInitialState = () => ({});
