import {getState, setState, updateState} from '../../utils/stateUtils';
import {deleteItemsWithMatchingProperty, replaceItemsWithMatchingProperty} from "../../utils/arrayUtils";
import {updateMultiSelectionOptionActivation} from "../../utils/optionListUtils";

export const APP_STATE_HAKUKOHTEEN_VALINTAKOE = 'APP_STATE_HAKUKOHTEEN_VALINTAKOE';

export const HakukohteenValintakoeStore = () => setState(APP_STATE_HAKUKOHTEEN_VALINTAKOE, getInitialState());

export const clearSelections = () => setState(APP_STATE_HAKUKOHTEEN_VALINTAKOE, getInitialState());

const getInitialState = () => ({
    valintakokeenTyyppiOptions: [
        {
            key: 'soveltuvuuskoe',
            label: 'Pääsy- ja soveltuvuuskoe'
        },
        {
            key: 'lisanaytto',
            label: 'Lisänäyttö'
        },
        {
            key: 'lisapiste',
            label: 'Lisäpiste'
        },
        {
            key: 'haastattelu',
            label: 'Haastattelu'
        },
        {
            key: 'ei-valintakoetta',
            label: 'Ei valintakoetta'
        }
    ],
    soveltuvuuskoeEntries: [],
    lisanayttoEntries: [],
    lisapisteEntries: [],
    haastatteluEntries: [],
    eiValintakoettaEntries: []
});

const createNewEntry = (entryId) => ({
    id: entryId.toString(),
    katuosoite: '',
    postinumero: '',
    postitoimipaikka: '',
    alkamishetki: {
        date: '',
        time: ''
    },
    paattymishetki: {
        date: '',
        time: ''
    },
    lisatiedot: ''
});

const getValue = (propertyName) => getState(APP_STATE_HAKUKOHTEEN_VALINTAKOE, propertyName);

const setValue = (propertyName, value) => updateState(APP_STATE_HAKUKOHTEEN_VALINTAKOE, {
    [propertyName]: value
});

export const getSoveltuvuuskoeEntries = () => getValue('soveltuvuuskoeEntries');

export const getLisanayttoEntries = () => getValue('lisanayttoEntries');

export const getLisapisteEntries = () => getValue('lisapisteEntries');

export const getHaastatteluEntries = () => getValue('haastatteluEntries');

export const getEiValintakoettaEntries = () => getValue('eiValintakoettaEntries');

export const getValintakokeenTyyppiOptions = () => getValue('valintakokeenTyyppiOptions');

export const setValintakokeenTyyppiOptions = (options) => setValue('valintakokeenTyyppiOptions', options);

export const updateValintakokeenTyyppiselection = (option) => setValintakokeenTyyppiOptions(
    updateMultiSelectionOptionActivation(getValintakokeenTyyppiOptions(), option)
);

export const updateSoveltuvuuskoe = (changedEntry) => updateEntry('soveltuvuuskoeEntries', changedEntry);

export const updateLisanaytto = (changedEntry) => updateEntry('lisanayttoEntries', changedEntry);

export const updateLisapiste = (changedEntry) =>  updateEntry('lisapisteEntries', changedEntry);

export const updateHaastattelu = (changedEntry) => updateEntry('haastatteluEntries', changedEntry);

export const updateEiValintakoetta = (changedEntry) => updateEntry('eiValintakoettaEntries', changedEntry);

const updateEntry = (containerName, changedEntry) => changedEntry['_delete'] ?
    deleteEntryFromContainer(containerName, changedEntry) : replaceEntryInContainer(containerName, changedEntry);

const deleteEntryFromContainer = (containerName, changedEntry) => setValue(
    containerName,
    deleteItemsWithMatchingProperty(getValue(containerName), changedEntry, 'id')
);

const replaceEntryInContainer = (containerName, changedEntry) => setValue(
    containerName,
    replaceItemsWithMatchingProperty(getValue(containerName), changedEntry, 'id')
);

const adddNewEntry = (containerName) => {
    const existingEntries = getValue(containerName);
    const newId = existingEntries.length + 1;
    const newEntries = existingEntries.concat([createNewEntry(newId)]);
    setValue(containerName, newEntries);
};

export const addNewSoveltuvuuskoe = () => adddNewEntry('soveltuvuuskoeEntries');

export const addNewLisanaytto = () => adddNewEntry('lisanayttoEntries');

export const addNewLisapiste = () => adddNewEntry('lisapisteEntries');

export const addNewHaastattelu = () => adddNewEntry('haastatteluEntries');

export const addNewEiValintakoetta = () => adddNewEntry('eiValintakoettaEntries');

export const isValintakokeenTyyppiActive = (key) => getValintakokeenTyyppiOptions().find(option => option.key === key).active === true;
