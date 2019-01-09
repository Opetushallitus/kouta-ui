import {initState, setState} from '../../utils/stateUtils';

export const APP_STATE_VALINTAPERUSTEEN_SORA_KUVAUS = 'APP_STATE_VALINTAPERUSTEEN_SORA_KUVAUS';

export const ValintaperusteenSoraKuvausStore = () => initState(APP_STATE_VALINTAPERUSTEEN_SORA_KUVAUS, getInitialState());

export const clearSelections = () => setState(APP_STATE_VALINTAPERUSTEEN_SORA_KUVAUS, getInitialState());

const getInitialState = () => ({});
