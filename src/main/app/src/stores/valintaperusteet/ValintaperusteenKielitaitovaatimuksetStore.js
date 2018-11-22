import {initState, setState} from '../../utils/stateUtils';

export const APP_STATE_VALINTAPERUSTEEN_KIELITAITOVAATIMUKSET = 'APP_STATE_VALINTAPERUSTEEN_KIELITAITOVAATIMUKSET';

export const ValintaperusteenKielitaitovaatimuksetStore = () => initState(APP_STATE_VALINTAPERUSTEEN_KIELITAITOVAATIMUKSET, getInitialState());

export const clearSelections = () => setState(APP_STATE_VALINTAPERUSTEEN_KIELITAITOVAATIMUKSET, getInitialState());

const getInitialState = () => ({});
