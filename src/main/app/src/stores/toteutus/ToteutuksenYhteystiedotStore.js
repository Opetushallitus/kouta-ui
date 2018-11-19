import {initState, setState} from '../../utils/stateUtils';

export const APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT = 'APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT';

export const ToteutuksenYhteystiedotStore = () => setState(APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT, {
  valueMap: getInitialValueMap(),
  fields: getFields()
});

export const clearValues = () => updateState(APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT, {
  valueMap: getInitialValueMap(),
  fields: getFields()
});

export const storeValues = (valueMap) => updateState(APP_STATE_TOTEUTUKSEN_YHTEYSTIEDOT, {valueMap});

const getInitialValueMap = () => ({
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

const getFields = () => [
  {
    id: 'nimi',
    label: 'Nimi'
  },
  {
    id: 'titteli',
    label: 'Titteli?'
  },
  {
    id: 'sahkoposti',
    label: 'Sähköposti'
  },
  {
    id: 'puhelinnumero',
    label: 'Puhelinnumero'
  }
];
