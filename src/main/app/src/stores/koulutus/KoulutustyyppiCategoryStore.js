import {clearState, connectToOne, getState, setState, updateState} from '../../utils/stateUtils';
import {
  APP_EVENT_CLEAR_KOULUTUSTYYPPI_SECTION, APP_EVENT_SELECT_KOULUTUSTYYPPI, APP_STATE_ACTIVE_KOULUTUSTYYPPI_CATEGORY,
  APP_STATE_KOULUTUSTYYPPI_OPTIONS
} from '../../config/states';

export const KoulutustyyppiCategoryStore = () => {
  configureKoulutustyyppiCategoryOptions();
  connectToOne(APP_EVENT_CLEAR_KOULUTUSTYYPPI_SECTION, {}, () => clearKoulutustyyppiCategory());
  connectToOne(APP_EVENT_SELECT_KOULUTUSTYYPPI, {}, (koulututustyyppi) => setKoulutustyyppiCategory(koulututustyyppi));
}

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

const clearKoulutustyyppiCategory = () =>  clearState(APP_STATE_ACTIVE_KOULUTUSTYYPPI_CATEGORY);

const setKoulutustyyppiCategory = (activeKoulutustyyppi) =>
    updateState(APP_STATE_ACTIVE_KOULUTUSTYYPPI_CATEGORY, activeKoulutustyyppi);

export const getKoulutustyyppiCategory = () => getState(APP_STATE_ACTIVE_KOULUTUSTYYPPI_CATEGORY);
