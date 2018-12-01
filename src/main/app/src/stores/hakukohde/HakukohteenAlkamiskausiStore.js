import {getState, setState, updateState} from '../../utils/stateUtils';
import {updateSingleSelectionOptionActivation} from "../../utils/optionListUtils";

export const APP_STATE_HAKUKOHTEEN_ALKAMISKAUSI = 'APP_STATE_HAKUKOHTEEN_ALKAMISKAUSI';

export const HakukohteenAlkamiskausiStore = () => setState(APP_STATE_HAKUKOHTEEN_ALKAMISKAUSI, getInitialState());

export const clearSelections = () => setState(APP_STATE_HAKUKOHTEEN_ALKAMISKAUSI, getInitialState());

//TODO: ainakin vuosi tulee muuttaa generoiduksi
const getInitialState = () => ({
    /* TODO: tulisiko lukukausiOptions ja lukuvuosiOptions siirtää eri storeen koska niitä käytetän myös muualla,
    esim. ValintaperusteEditorModalBox */
    lukukausiOptions: [
        {
            key: 'kevät',
            label: 'Kevät'
        },
        {
            key: 'kesä',
            label: 'Kesä',
        },
        {
            key: 'syksy',
            label: 'Syksy'
        }
    ],
    lukuvuosiOptions: [
        {
            key: '2019',
            label: '2019'
        },
        {
            key: '2020',
            label: '2020',
        },
        {
            key: '2021',
            label: '2021'
        }
    ],
    lukukausiSelection: {},
    lukuvuosiSelection: {}
});

const getLukukausiOptions = () => getState(APP_STATE_HAKUKOHTEEN_ALKAMISKAUSI, 'lukukausiOptions');

const getVuosiOptions = () =>  getState(APP_STATE_HAKUKOHTEEN_ALKAMISKAUSI, 'lukuvuosiOptions');

//aktiivista valintaa säilytetään erillisessä selectionissa koska optioneita tarvitaan useammissa komponenteissa
export const selectLukukausi = (change) => updateState(APP_STATE_HAKUKOHTEEN_ALKAMISKAUSI, {
    lukukausiSelection: {
        [change.key]: change.active
    }
});

//aktiivista valintaa säilytetään erillisessä selectionissa koska optioneita tarvitaan useammissa komponenteissa
export const selectLukuvuosi = (change) => updateState(APP_STATE_HAKUKOHTEEN_ALKAMISKAUSI, {
    lukuvuosiSelection: {
        [change.key]: change.active
    }
});



