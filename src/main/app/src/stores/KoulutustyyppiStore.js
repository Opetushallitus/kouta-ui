import {getState, setState, updateState} from '../utils/stateUtils';
import {APP_STATE_KOULUTUSTYYPPI} from '../config/states';
import {activeKoulutustyyppi, koulutustyyppiOptions} from '../model/Koulutustyyppi';

export const KoulutustyyppiStore = () => configureKoulutustyyppiOptions();

export const configureKoulutustyyppiOptions = () => setState(APP_STATE_KOULUTUSTYYPPI, {
  [koulutustyyppiOptions]: [
    {
      value: 'amm',
      label: 'Ammatillinen koulutus'
    },
    {
      value: 'kk',
      label: 'Korkeakoulukoulutus'
    },
    {
      value: 'lk',
      label: 'Lukiokoulutus'
    }
  ]
});

export const setKoulutustyyppi = (koulutustyyppi) => updateState(APP_STATE_KOULUTUSTYYPPI, {
  [activeKoulutustyyppi]: koulutustyyppi
});

export const getKoulutustyyppi = () => getState(APP_STATE_KOULUTUSTYYPPI, [activeKoulutustyyppi]);