import {ENTITY_MODIFICATION_MODE} from '../../config/constants';
import {initStates} from '../../utils/stateUtils';
import {
  EVENT_ENTRY, EVENT_MODE, STATE_ENTRY, STATE_ENTRY_LIST, STATE_ENTRY_OPTIONS,
  STATE_MODE, STATE_MODE_OPTIONS
} from '../../config/scopes/PohjanValinta';

export const APP_STATE_HAUN_POHJA_MODE_OPTIONS = 'APP_STATE_HAUN_POHJA_MODE_OPTIONS';
export const APP_STATE_HAUN_POHJA_MODE = 'APP_STATE_HAUN_POHJA_MODE';
export const APP_EVENT_HAUN_POHJA_MODE = 'APP_EVENT_HAUN_POHJA_MODE';
export const APP_STATE_HAUN_POHJA_ENTRY_LIST = 'APP_STATE_HAUN_POHJA_ENTRY_LIST';
export const APP_STATE_HAUN_POHJA_ENTRY_OPTIONS = 'APP_STATE_HAUN_POHJA_ENTRY_OPTIONS';
export const APP_STATE_HAUN_POHJA_ENTRY = 'APP_STATE_HAUN_POHJA_ENTRY';
export const APP_EVENT_HAUN_POHJA_ENTRY = 'APP_EVENT_HAUN_POHJA_ENTRY';

export const SCOPE_HAUN_POHJA = {
  [STATE_ENTRY_LIST]: APP_STATE_HAUN_POHJA_ENTRY_LIST,
  [STATE_ENTRY_OPTIONS]: APP_STATE_HAUN_POHJA_ENTRY_OPTIONS,
  [STATE_MODE]: APP_STATE_HAUN_POHJA_MODE,
  [STATE_MODE_OPTIONS]: APP_STATE_HAUN_POHJA_MODE_OPTIONS,
  [STATE_ENTRY]: APP_STATE_HAUN_POHJA_ENTRY,
  [EVENT_ENTRY]: APP_EVENT_HAUN_POHJA_ENTRY,
  [EVENT_MODE]: APP_EVENT_HAUN_POHJA_MODE
};

export const HaunPohjaStore = () => initStates({
  [APP_STATE_HAUN_POHJA_MODE_OPTIONS]: getModeOptions(),
  [APP_STATE_HAUN_POHJA_ENTRY_OPTIONS]: getEntryOptions()
});

const getModeOptions = () => [
  {
    label: 'Luo uusi haku',
    value: ENTITY_MODIFICATION_MODE.CREATE_ENTITY
  },
  {
    label: 'Kopioi pohjaksi aiemmin luotu haku',
    value: ENTITY_MODIFICATION_MODE.INHERIT_ENTITY
  },
  {
    label: 'Käytä olemassa olevan haun tietoja',
    value: ENTITY_MODIFICATION_MODE.USE_ENTITY
  }
];

//TODO: replace this with entries coming from backend
const getEntryOptions = () => [
  {
    label: 'Toteutettu haku 1',
    value:  'Toteutettu haku 1'
  },
  {
    label: 'Toteutettu haku 2',
    value:  'Toteutettu haku 2'
  },
  {
    label: 'Toteutettu haku 3',
    value:  'Toteutettu haku 3'
  }
];
