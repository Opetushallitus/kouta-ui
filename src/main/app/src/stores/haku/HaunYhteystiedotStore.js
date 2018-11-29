import {setState, updateState} from '../../utils/stateUtils';
import {getFields, getInitialValueMap} from '../generic/YhteystiedotStore';

export const APP_STATE_HAUN_YHTEYSTIEDOT = 'APP_STATE_HAUN_YHTEYSTIEDOT';

export const HaunYhteystiedotStore = () => setState(APP_STATE_HAUN_YHTEYSTIEDOT, {
  valueMap: getInitialValueMap(),
  fields: getFields()
});

export const clearValues = () => updateState(APP_STATE_HAUN_YHTEYSTIEDOT, {
  valueMap: getInitialValueMap(),
  fields: getFields()
});

export const storeValues = (valueMap) => updateState(APP_STATE_HAUN_YHTEYSTIEDOT, {valueMap: valueMap});
