import {initState, setState} from '../../utils/stateUtils';

export const APP_STATE_VALINTAPERUSTEEN_OSAAMISTAUSTA = 'APP_STATE_VALINTAPERUSTEEN_OSAAMISTAUSTA';

export const ValintaperusteenOsaamistaustaStore = () => initState(APP_STATE_VALINTAPERUSTEEN_OSAAMISTAUSTA, getInitialState());

export const clearSelections = () => setState(APP_STATE_VALINTAPERUSTEEN_OSAAMISTAUSTA, getInitialState());

//TODO: check if there is API for this && implement as API request
const getInitialState = () => ({
  options: [
    {
      key: 'ammatillinen-perustutkinto',
      label: 'ammatillinen perustutkinto'
    },
    {
      key: 'ammattitutkinto',
      label: 'ammattitutkinto'
    },
    {
      key: 'eb-tutkinto',
      label: 'EB-tutkinto'
    },
    {
      key: 'ib-tutkinto',
      label: 'IB-tutkinto'
    },
    {
      key: 'erikoisammattitutkinto',
      label: 'erikoisammattitutkinto'
    },
    {
      key: 'hakija-muutoin-riittavat-tutkinnot',
      label: 'hakija, jolla korkeakoulu toteaa muutoin olevan opintoja varten riittävät tutkinnot'
    },
    {
      key: 'lukion-oppimaara',
      label: 'Lukion oppimäärä'
    },
    {
      key: 'rp-dia-tutkinto',
      label: 'RP/DIA-tutkinto'
    },
    {
      key: 'ulkomainen-koulutus',
      label: 'ulkomainen koulutus, joka antaa asianomaisessa maassa kelpoisuuden korkeakouluopintoihin'
    },
    {
      key: 'ylioppilas',
      label: 'Ylioppilas'
    },
    {
      key: 'muu-valinta',
      label: 'Muu, mikä?',
      input: true
    }
  ]
});
