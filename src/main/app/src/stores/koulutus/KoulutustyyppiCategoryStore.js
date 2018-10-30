import {clearState, getState, handleEvents, setState, updateState} from '../../utils/stateUtils';
import {
  APP_EVENT_CLEAR_KOULUTUSTYYPPI_SECTION,
  APP_EVENT_SELECT_KOULUTUSTYYPPI,
  APP_STATE_ACTIVE_KOULUTUSTYYPPI_CATEGORY,
  APP_STATE_KOULUTUSTYYPPI_OPTIONS
} from '../../config/states';

export const KoulutustyyppiCategoryStore = () => {
  configureKoulutustyyppiCategoryOptions();
  handleEvents({
    [APP_EVENT_CLEAR_KOULUTUSTYYPPI_SECTION]: () => clearKoulutustyyppiCategory(),
    [APP_EVENT_SELECT_KOULUTUSTYYPPI]: (koulutustyyppi) => setKoulutustyyppiCategory(koulutustyyppi)
  });
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
