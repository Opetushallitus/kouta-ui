import {initState, setState, updateState} from '../../utils/stateUtils';
import {getFields, getInitialValueMap} from '../generic/YhteystiedotStore';

export const APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT = 'APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT';

export const ToteutuksenYhteystiedotStore = () => {
  initState(APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT, {
        valueMap: getInitialValueMap(),
        fields: getFields()
    });
};

export const clearValues = () => updateState(APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT, {
  valueMap: getInitialValueMap(),
  fields: getFields()
});

export const storeValues = (valueMap) => updateState(APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT, {valueMap: valueMap});
