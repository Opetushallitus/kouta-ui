import {getState, setState, updateState} from '../../utils/stateUtils';
import {replaceItemsWithMatchingProperty} from "../../utils/arrayUtils";

export const APP_STATE_HAKUKOHTEEN_TARVITTAVAT_LIITTEET = 'APP_STATE_HAKUKOHTEEN_TARVITTAVAT_LIITTEET';

export const HakukohteenTarvittavatLiitteetStore = () => setState(APP_STATE_HAKUKOHTEEN_TARVITTAVAT_LIITTEET, getInitialState());

export const clearSelections = () => setState(APP_STATE_HAKUKOHTEEN_TARVITTAVAT_LIITTEET, getInitialState());

//TODO: korvataan tämä APIsta tulevilla datoilla
const getInitialState = () => ({
    hakukohteenLiiteEntries: [
        createHakukohteenLiiteEntry(1)
    ]
});

const createHakukohteenLiiteEntry = (id) => ({
    id: id.toString(),
    liitteenTyyppiOptions: [
        {
            key: 'tutkintotodistus',
            label: 'Tutkintotodistus'
        },
        {
            key: 'todistus',
            label: 'Todistus'
        },
        {
            key: 'portfolio',
            label: 'Portfolio'
        }
    ],
    liitteenNimi: '',
    liitteenKuvaus: '',
    liitteenTakaraja: {
        date: '',
        time: ''
    },
    samaOsoiteKaikissaLiitteissa: false,
    toimitusosoiteOptions: [
        {
            key: 'hakijapalvelun-osoite',
            label: 'Koulutuksen järjestäjän hakijapalvelun osoite',
            content: {
                jarjestajanNimi: 'Koulutuskeuskus Salpaus-kuntayhtymä',
                katuosoite: 'Paasikivenkatu 7',
                postinumero: '15110',
                postitoimipaikka: 'Lahti',
                sahkoposti: 'salpaus@salapaus.fi'
            }
        },
        {
            key: 'vaihtoehtoinen-toimitusosoite',
            label: 'Toinen toimitusosoite'
        }
    ],
    vaihtoehtoinenToimitusosoite: {
        jarjestajanNimi: '',
        katuosoite: '',
        postinumero: '',
        postitoimipaikka: '',
        sahkoposti: ''
    }
});

export const getHakukohteenLiiteEntries = () => getState(APP_STATE_HAKUKOHTEEN_TARVITTAVAT_LIITTEET, 'hakukohteenLiiteEntries');

const setHakukohteenLiiteEntries = (hakukohteenLiiteEntries) => updateState(APP_STATE_HAKUKOHTEEN_TARVITTAVAT_LIITTEET, {
    hakukohteenLiiteEntries
});

export const updateHakukohteenLiite = (changedHakukohteenLiite) => setHakukohteenLiiteEntries(
    replaceItemsWithMatchingProperty(getHakukohteenLiiteEntries(), changedHakukohteenLiite, 'id')
);

export const addNewHakukohteenLiite = () => {
    const hakukohteenLiiteEntries = getHakukohteenLiiteEntries();
    const newId = hakukohteenLiiteEntries.length + 1;
    const newEntries = hakukohteenLiiteEntries.concat([createHakukohteenLiiteEntry(newId)]);
    setHakukohteenLiiteEntries(newEntries);
};
