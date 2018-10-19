import {getState, setState, updateState} from '../utils/stateUtils';
import {APP_STATE_ACTIVE_KOULUTUSTYYPPI_CATEGORY, APP_STATE_KOULUTUSTYYPPI_OPTIONS} from '../config/states';

export const KoulutustyyppiCategoryStore = () => configureKoulutustyyppiCategoryOptions();

export const configureKoulutustyyppiCategoryOptions = () => setState(APP_STATE_KOULUTUSTYYPPI_OPTIONS, [
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

export const setKoulutustyyppiCategory = (activeKoulutustyyppi) => updateState(APP_STATE_ACTIVE_KOULUTUSTYYPPI_CATEGORY, activeKoulutustyyppi);

export const getKoulutustyyppiCategory = () => getState(APP_STATE_ACTIVE_KOULUTUSTYYPPI_CATEGORY);
