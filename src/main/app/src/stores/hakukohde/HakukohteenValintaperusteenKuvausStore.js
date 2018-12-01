import {initState, setState, updateState} from '../../utils/stateUtils';

export const APP_STATE_HAKUKOHTEEN_VALINTAPERUSTEEN_KUVAUS = 'APP_STATE_HAKUKOHTEEN_VALINTAPERUSTEEN_KUVAUS';

export const HakukohteenValintaperusteenKuvausStore = () => initState(APP_STATE_HAKUKOHTEEN_VALINTAPERUSTEEN_KUVAUS, getInitialState());

export const clearSelections = () => setState(APP_STATE_HAKUKOHTEEN_VALINTAPERUSTEEN_KUVAUS, getInitialState());

const getInitialState = () => ({
    valintaperusteSelections: {}
});

export const selectHakukohteenValintaperuste = (option) => updateState(APP_STATE_HAKUKOHTEEN_VALINTAPERUSTEEN_KUVAUS, {
    valintaperusteSelections: {
        [option.key]: true
    }
})
