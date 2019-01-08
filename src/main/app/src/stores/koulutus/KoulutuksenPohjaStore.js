import {urls} from 'oph-urls-js';
import {
    EVENT_ENTRY,
    EVENT_MODE,
    STATE_ENTRY,
    STATE_ENTRY_LIST,
    STATE_ENTRY_OPTIONS,
    STATE_MODE,
    STATE_MODE_OPTIONS
} from '../../config/scopes/PohjanValinta';
import {ENTITY_MODIFICATION_MODE} from '../../config/constants';
import {setStates} from "../../utils/stateUtils";
import axios from "axios/index";

export const APP_STATE_KOULUTUKSEN_POHJA_MODE_OPTIONS = 'APP_STATE_KOULUTUKSEN_POHJA_MODE_OPTIONS';
export const APP_STATE_KOULUTUKSEN_POHJA_MODE = 'APP_STATE_KOULUTUKSEN_POHJA_MODE';
export const APP_EVENT_KOULUTUKSEN_POHJA_MODE = 'APP_EVENT_KOULUTUKSEN_POHJA_MODE';
export const APP_STATE_KOULUTUKSEN_POHJA_ENTRY_LIST = 'APP_STATE_KOULUTUKSEN_POHJA_ENTRY_LIST';
export const APP_STATE_KOULUTUKSEN_POHJA_ENTRY_OPTIONS = 'APP_STATE_KOULUTUKSEN_POHJA_ENTRY_OPTIONS';
export const APP_STATE_KOULUTUKSEN_POHJA_ENTRY = 'APP_STATE_KOULUTUKSEN_POHJA_ENTRY';
export const APP_EVENT_KOULUTUKSEN_POHJA_ENTRY = 'APP_EVENT_KOULUTUKSEN_POHJA_ENTRY';

export const SCOPE_KOULUTUKSEN_POHJA = {
    [STATE_ENTRY_LIST]: APP_STATE_KOULUTUKSEN_POHJA_ENTRY_LIST,
    [STATE_ENTRY_OPTIONS]: APP_STATE_KOULUTUKSEN_POHJA_ENTRY_OPTIONS,
    [STATE_MODE]: APP_STATE_KOULUTUKSEN_POHJA_MODE,
    [STATE_MODE_OPTIONS]: APP_STATE_KOULUTUKSEN_POHJA_MODE_OPTIONS,
    [STATE_ENTRY]: APP_STATE_KOULUTUKSEN_POHJA_ENTRY,
    [EVENT_ENTRY]: APP_EVENT_KOULUTUKSEN_POHJA_ENTRY,
    [EVENT_MODE]: APP_EVENT_KOULUTUKSEN_POHJA_MODE
};

export const KoulutuksenPohjaStore = () => {
    setStates({
        [APP_STATE_KOULUTUKSEN_POHJA_MODE_OPTIONS]: getModeOptions(),
        [APP_STATE_KOULUTUKSEN_POHJA_ENTRY_OPTIONS]: getEntryOptions()
    });
    axios.get(urls.url('kouta-backend.koulutus-list')).then(response => configureData(response.data));
};

const configureData = (data) => {
    //TODO: toteuta data konfigurointi
};

const getModeOptions = () => [
  {
    label: 'Luo uusi koulutus',
    value: ENTITY_MODIFICATION_MODE.CREATE_ENTITY
  },
  {
    label: 'Kopioi pohjaksi aiemmin luotu koulutus',
    value: ENTITY_MODIFICATION_MODE.INHERIT_ENTITY
  },
  {
    label: 'Käytä olemassa olevan koulutuksen tietoja',
    value: ENTITY_MODIFICATION_MODE.USE_ENTITY
  }
];

//TODO: replace this with entries coming from backend
const getEntryOptions = () => [
    {
        label: 'Koulutus 1',
        value: 'Koulutus 1',
    },
    {
        label: 'Koulutus 2',
        value: 'Koulutus 2'
    },
    {
        label: 'Koulutus 3',
        value: 'Koulutus 3'
    }
];

