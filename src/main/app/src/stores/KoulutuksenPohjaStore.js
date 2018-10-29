import {connectToOne, updateState} from '../utils/stateUtils';
import {APP_EVENT_KOULUTUS_MODIFICATION_MODE, APP_STATE_KOULUTUS_MODIFICATION_MODE} from '../config/states';
import {ENTITY_MODIFICATION_MODE} from '../config/constants';

export const KoulutuksenPohjaStore = () => updateState(APP_STATE_KOULUTUS_MODIFICATION_MODE, {
  creationMode: ENTITY_MODIFICATION_MODE.CREATE_ENTITY
});

connectToOne(APP_EVENT_KOULUTUS_MODIFICATION_MODE, {}, (creationMode) => updateState(
  APP_STATE_KOULUTUS_MODIFICATION_MODE, {creationMode}
));
