import {getState, setState, updateState} from '../utils/stateUtils';
import {APP_STATE_ACTIVE_KOULUTUSTYYPPI, APP_STATE_KOULUTUSTYYPPI_OPTIONS} from '../config/states';

export const KoulutustyyppiStore = () => configureKoulutustyyppiOptions();

export const configureKoulutustyyppiOptions = () => setState(APP_STATE_KOULUTUSTYYPPI_OPTIONS, [
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
    }]
);

export const setKoulutustyyppi = (activeKoulutustyyppi) => updateState(APP_STATE_ACTIVE_KOULUTUSTYYPPI, activeKoulutustyyppi);

export const getKoulutustyyppi = () => getState(APP_STATE_ACTIVE_KOULUTUSTYYPPI);