import {initState, setState, updateState} from '../../utils/stateUtils';

export const APP_STATE_HAKUKOHTEEN_PERUSTIEDOT = 'APP_STATE_HAKUKOHTEEN_PERUSTIEDOT';

export const HakukohteenPerustiedotStore = () => initState(APP_STATE_HAKUKOHTEEN_PERUSTIEDOT, getInitialState());

const getInitialState = () => ({
  nimi: {
    fi: '',
    sv: '',
    en: ''
  },
  kaksoistutkintoActive: false
});

export const updateNimi = (language, localizedName) => updateState(APP_STATE_HAKUKOHTEEN_PERUSTIEDOT, {
  nimi: {
    [language]: localizedName
  }
});

export const setKaksoistutkintoActive = (kaksoistutkintoActive) => updateState(APP_STATE_HAKUKOHTEEN_PERUSTIEDOT, {
  kaksoistutkintoActive
});

export const clearSelections = () => setState(APP_STATE_HAKUKOHTEEN_PERUSTIEDOT, getInitialState());
