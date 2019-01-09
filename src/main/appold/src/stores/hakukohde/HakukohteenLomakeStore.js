import {getState, setState, updateState} from '../../utils/stateUtils';
import {getActiveKey, updateSingleSelectionOptionActivation} from "../../utils/optionListUtils";

export const APP_STATE_HAKUKOHTEEN_LOMAKKEET = 'APP_STATE_HAKUKOHTEEN_LOMAKKEET';

export const HakukohteenLomakeStore = () => setState(APP_STATE_HAKUKOHTEEN_LOMAKKEET, getInitialState());

export const clearSelections = () => setState(APP_STATE_HAKUKOHTEEN_LOMAKKEET, getInitialState());

export const HAKULOMAKE_TYPE = {
    HAKEMUSPALVELU: 'ataru',
    JARJESTELMA: 'haku-app',
    MUU: 'muu',
    EI_SAHKOINEN: 'ei sähköistä'
};

export const changeLomakkeenTyyppiSelection = (change) => {
    const lomakkeenTyyppiOptions = updateSingleSelectionOptionActivation(getHakulomakkeenTyyppiOptions(), change);
    const activeLomakkeenTyyppi = getActiveKey(lomakkeenTyyppiOptions);
    updateState(APP_STATE_HAKUKOHTEEN_LOMAKKEET, {
        lomakkeenTyyppiOptions,
        activeLomakkeenTyyppi
    });
};

const getInitialState = () => ({
        activeLomakkeenTyyppi: null,
        lomakkeenTyyppiOptions: getHakulomakkeenTyyppiInitialOptions(),
        jarjestelmalomakeOptions: getJarjestelmalomakeInitialOptions(),
        hakemuspalvelunLomakeOptions: getHakemuspalvelunLomakeInitialOptions(),
        form: {
            muuLomake: ''
        }
    }
);

export const selectHakemuspalvelunLomake = (change) => updateState(APP_STATE_HAKUKOHTEEN_LOMAKKEET, {
    hakemuspalvelunLomakeOptions: updateSingleSelectionOptionActivation(getHakemuspalvelunLomakeOptions(), change)
});

export const selectJarjestelmalomake = (change) => updateState(APP_STATE_HAKUKOHTEEN_LOMAKKEET, {
    jarjestelmalomakeOptions: updateSingleSelectionOptionActivation(getJarjestelmalomakeOptions(), change)
});

export const updateMuuLomakeValue = (value) => updateState(APP_STATE_HAKUKOHTEEN_LOMAKKEET, {
    form: {
        muuLomake: value
    }
});

const getHakulomakkeenTyyppiOptions = () => getState(APP_STATE_HAKUKOHTEEN_LOMAKKEET, 'lomakkeenTyyppiOptions');

const getHakulomakkeenTyyppiInitialOptions = () => [
    {
        key: HAKULOMAKE_TYPE.HAKEMUSPALVELU,
        label: 'Käytetään hakemuspalvelun lomaketta'
    },
    {
        key: HAKULOMAKE_TYPE.JARJESTELMA,
        label: 'Käytetään järjestelmän hakulomaketta'
    },
    {
        key: HAKULOMAKE_TYPE.MUU,
        label: 'Käytetään muuta hakulomaketta'
    },
    {
        key: HAKULOMAKE_TYPE.EI_SAHKOINEN,
        label: 'Ei sähköistä hakua'
    }
];

//TODO: change these to be loaded from API
const getHakemuspalvelunLomakeInitialOptions = () => [
    {
        key: 'hakemuspalvelun-lomake-1',
        label: 'Hakemuspalvelun lomake 1'
    },
    {
        key: 'hakemuspalvelun-lomake-2',
        label: 'Hakemuspalvelun lomake 2'
    },
    {
        key: 'hakemuspalvelun-lomake-3',
        label: 'Hakemuspalvelun lomake 3'
    }
];

//TODO: change these to be loaded from API
const getJarjestelmalomakeInitialOptions = () => [
    {
        key: 'jarjestelmalomake-1',
        label: 'Järjestelmälomake 1'
    },
    {
        key: 'jarjestelmalomake-2',
        label: 'Järjestelmälomake 2'
    },
    {
        key: 'jarjestelmalomake-3',
        label: 'Järjestelmälomake 3'
    }
];

const getHakemuspalvelunLomakeOptions = () => getState(APP_STATE_HAKUKOHTEEN_LOMAKKEET, 'hakemuspalvelunLomakeOptions');

const getJarjestelmalomakeOptions = () => getState(APP_STATE_HAKUKOHTEEN_LOMAKKEET, 'jarjestelmalomakeOptions');
