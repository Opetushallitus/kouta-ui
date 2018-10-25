import {connectToOne, updateState} from '../utils/stateUtils';
import {APP_EVENT_KOULUTUS_CREATION_MODE, APP_STATE_KOULUTUS_CREATION_MODE} from '../config/states';
import {EVENT_KOULUTUS_CREATION_MODE} from '../config/constants';

export const KoulutuksenPohjaStore = () => updateState(APP_STATE_KOULUTUS_CREATION_MODE, {
  creationMode: EVENT_KOULUTUS_CREATION_MODE.NEW_KOULUTUS
});

connectToOne(APP_EVENT_KOULUTUS_CREATION_MODE, {}, (creationMode) => updateState(
  APP_STATE_KOULUTUS_CREATION_MODE, {creationMode}
));
