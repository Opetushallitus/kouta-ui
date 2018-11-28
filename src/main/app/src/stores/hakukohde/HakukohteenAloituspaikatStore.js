import {initState, setState, updateState} from '../../utils/stateUtils';

export const APP_STATE_HAKUKOHTEEN_ALOITUSPAIKAT = 'APP_STATE_HAKUKOHTEEN_ALOITUSPAIKAT';

export const HakukohteenAloituspaikatStore = () => initState(APP_STATE_HAKUKOHTEEN_ALOITUSPAIKAT, getInitialState());

export const clearSelections = () => setState(APP_STATE_HAKUKOHTEEN_ALOITUSPAIKAT, getInitialState());

const getInitialState = () => ({
  aloituspaikkojenLukumaara: null
});

export const setAloituspaikkojenLukumaara = (aloituspaikkojenLukumaara) => updateState(APP_STATE_HAKUKOHTEEN_ALOITUSPAIKAT, {
  aloituspaikkojenLukumaara
});

