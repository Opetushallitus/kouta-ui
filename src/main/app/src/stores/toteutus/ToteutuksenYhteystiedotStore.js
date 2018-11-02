import {initState, setState} from '../../utils/stateUtils';
import {APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT} from '../../config/states';

export const ToteutuksenYhteystiedotStore = () => initState(APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT, getInitialState());

export const clearValues = () => setState(APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT, getInitialState());

export const storeValues = (values) => setState(APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT, values);

const getInitialState = () => ({
  nimi: {
    fi: '',
    sv: '',
    en: ''
  },
  titteli: {
    fi: '',
    sv: '',
    en: ''
  },
  sahkoposti: {
    fi: '',
    sv: '',
    en: ''
  },
  puhelinnumero: {
    fi: '',
    sv: '',
    en: ''
  }
});
