import {getState, setState, updateState} from '../../utils/stateUtils';
import {updateSingleSelectionOptionActivation} from '../../utils/optionListUtils';

export const APP_STATE_VALINTAPERUSTEEN_VAHIMMAISEHDOT = 'APP_STATE_VALINTAPERUSTEEN_VAHIMMAISEHDOT';

export const ValintaperusteenVahimmaisehdotStore = () => setState(APP_STATE_VALINTAPERUSTEEN_VAHIMMAISEHDOT, getInitialState());

export const clearSelections = () => setState(APP_STATE_VALINTAPERUSTEEN_VAHIMMAISEHDOT, getInitialState());

//TODO: check if there is API for this && implement as API request
const getInitialState = () => ({
  options: [
    {
      key: 'osoittaa-tarvittaessa-hakukelpoisuuden-määräajan-kuluessa',
      label: 'osoittaa tarvittaessa hakukelpoisuuden määräajan kuluessa'
    },
    {
      key: 'toimittaa-hakemuksen-määräajan-kuluessa',
      label: 'toimittaa hakemuksen määräajan kuluessa'
    },
    {
      key: 'osallistuu-valintakokeen-ja-suorittaa-sen-hyvaksyttavasti',
      label: 'osallistuu valintakokeeseen ja suorittaa sen hyväksyttävästi'
    },
    {
      key: 'suorittaa-mahdolliset-lisanaytot',
      label: 'suorittaa mahdolliset lisänäytöt'
    }
  ]
});

const getOptions = () => getState(APP_STATE_VALINTAPERUSTEEN_VAHIMMAISEHDOT, 'options');

export const selectOption = (change) => updateState(APP_STATE_VALINTAPERUSTEEN_VAHIMMAISEHDOT, {
  options: updateSingleSelectionOptionActivation(getOptions(), change)
});
