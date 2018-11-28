import {getState, setState, updateState} from '../../utils/stateUtils';

export const APP_STATE_HAKUKOHTEEN_HAKUAJAT = 'APP_STATE_HAKUKOHTEEN_HAKUAJAT';

export const HakukohteenHakuajatStore = () => setState(APP_STATE_HAKUKOHTEEN_HAKUAJAT, getInitialState());

export const clearSelections = () => setState(APP_STATE_HAKUKOHTEEN_HAKUAJAT, getInitialState());

const getInitialState = () => ({
    hakuaika: {
        alkamishetki: {
            date: '08.10.2018',
            time: ''
        },
        paattymishetki: {
            date: '30.10.2018',
            time: ''
        }
    },
    poikkeavaHakukohteenHakuaika: true,
    hakukohteenHakuaikaEntries: [
        createEmptyHakuaika(1)
    ]
});

const createEmptyHakuaika = (id) => ({
    id: id.toString(),
    alkamishetki: {
        date: '',
        time: ''
    },
    paattymishetki: {
        date: '',
        time: '',
    }
});

export const setPoikkeavaHakuaika = (poikkeavaHakukohteenHakuaika) => updateState(APP_STATE_HAKUKOHTEEN_HAKUAJAT, {
    poikkeavaHakukohteenHakuaika
});

const getHakukohteenHakuaikaEntries = () => getState(APP_STATE_HAKUKOHTEEN_HAKUAJAT, 'hakukohteenHakuaikaEntries');

export const addHakuaika = () => {
    const hakukohteenHakuaikaEntries = getHakukohteenHakuaikaEntries();
    const entryCount = hakukohteenHakuaikaEntries.length;
    const newEntryId = (entryCount + 1).toString();
    const newEntry = {
        id: newEntryId,
        date: '',
        time: ''
    };
    hakukohteenHakuaikaEntries.push(newEntry);
    updateState(APP_STATE_HAKUKOHTEEN_HAKUAJAT, {
        hakukohteenHakuaikaEntries
    });
};

export const updateHakuaika = (updatedHakuaika) => updateState(APP_STATE_HAKUKOHTEEN_HAKUAJAT, {
    hakuaikaEntries: getHakukohteenHakuaikaEntries().map(existingHakuaika => existingHakuaika.id === updatedHakuaika.id ? updatedHakuaika : existingHakuaika)
});

