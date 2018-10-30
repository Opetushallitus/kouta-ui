import {handleEvent, updateState} from '../../utils/stateUtils';
import {APP_EVENT_TOTEUTUS_MODIFICATION_MODE, APP_STATE_TOTEUTUS_MODIFICATION_MODE} from '../../config/states';
import {ENTITY_MODIFICATION_MODE} from '../../config/constants';

export const ToteutuksenPohjaStore = () => updateState(APP_STATE_TOTEUTUS_MODIFICATION_MODE, {
  modificationMode: ENTITY_MODIFICATION_MODE.CREATE_ENTITY
});

handleEvent(APP_EVENT_TOTEUTUS_MODIFICATION_MODE, (modificationMode) => updateState(
  APP_STATE_TOTEUTUS_MODIFICATION_MODE, {modificationMode}
));
