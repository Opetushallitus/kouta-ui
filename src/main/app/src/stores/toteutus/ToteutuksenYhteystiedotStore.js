import {initState, setState} from '../../utils/stateUtils';

export const APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT = 'APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT';

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
