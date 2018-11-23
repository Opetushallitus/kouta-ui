import {initState, setState} from '../../utils/stateUtils';

export const APP_STATE_VALINTAPERUSTEEN_VAHIMMAISEHDOT = 'APP_STATE_VALINTAPERUSTEEN_VAHIMMAISEHDOT';

export const ValintaperusteenVahimmaisehdotStore = () => initState(APP_STATE_VALINTAPERUSTEEN_VAHIMMAISEHDOT, getInitialState());

export const clearSelections = () => setState(APP_STATE_VALINTAPERUSTEEN_VAHIMMAISEHDOT, getInitialState());

//TODO: check if there is API for this && implement as API request
const getInitialState = () => ({
  options: [
    {
      label: 'osoittaa-tarvittaessa-hakukelpoisuuden-määräajan-kuluessa',
      label: 'osoittaa tarvittaessa hakukelpoisuuden määräajan kuluessa'
    },
    {
      label: 'toimittaa-hakemuksen-määräajan-kuluessa',
      label: 'toimittaa hakemuksen määräajan kuluessa'
    },
    {
      label: 'osallistuu-valintakokeen-ja-suorittaa-sen-hyvaksyttavasti',
      label: 'osallistuu valintakokeeseen ja suorittaa sen hyväksyttävästi'
    },
    {
      label: 'suorittaa-mahdolliset-lsianaytot',
      label: 'suorittaa mahdolliset lisänäytöt'
    }
  ]
});
