import {getState, initState, setState, updateState} from '../../utils/stateUtils';
import {updateSingleSelectionOptionActivation} from '../../utils/optionListUtils';

export const APP_STATE_VALINTAPERUSTEEN_KOHDEJOUKKO = 'APP_STATE_VALINTAPERUSTEEN_KOHDEJOUKKO';

export const ValintaperusteenHaunKohdejoukkoStore = () => initState(APP_STATE_VALINTAPERUSTEEN_KOHDEJOUKKO, getInitialState());

export const clearSelections = () => setState(APP_STATE_VALINTAPERUSTEEN_KOHDEJOUKKO, getInitialState());

//TODO: check if there is API for this && implement as API request
const getInitialState = () => ({
  options: [
    {
      key: 'haunkohdejoukko_10#1',
      label : '10 Aikuiskoulutus'
    },
    {
      key: 'haunkohdejoukko_11#1',
      label : '11 Ammatillinen koulutus ja lukiokoulutus'
    },
    {
      key: 'haunkohdejoukko_12#1',
      label : '12 Korkeakoulutus'
    },
    {
      key: 'haunkohdejoukko_13#1',
      label : '13 Täydennyskoulutus'
    },
    {
      key: 'haunkohdejoukko_13#1',
      label : '13 Vapaa sivistystyö'
    },
    {
      key: 'haunkohdejoukko_15#1',
      label : '15 Ammatillinen peruskoulutus erityisopetuksena'
    },
    {
      key: 'haunkohdejoukko_16#1',
      label : '16 Valmentava ja kuntouttava koulutus'
    },
    {
      key: 'haunkohdejoukko_17#1',
      label : '17 Perusopetuksen jälkeinen valmistava koulutus'
    },
    {
      key: 'haunkohdejoukko_18#1',
      label : '18 Vapaan sivistystyön koulutus'
    },
    {
      key: 'haunkohdejoukko_19#1',
      label : '19 Aikuisten perusopetus'
    },
    {
      key: 'haunkohdejoukko_20#1',
      label : '20 Erityisopetuksena järjestettävä ammatillinen koulutus'
    },
    {
      key: 'haunkohdejoukko_21#1',
      label : '21 Yhteishaun ulkopuolinen lukiokoulutus'
    },
    {
      key: 'haunkohdejoukko_22#1',
      label : '22 Pelastusalan koulutus'
    },
    {
      key: 'haunkohdejoukko_23#1',
      label : '23 Ammatillinen koulutus'
    },
    {
      key: 'haunkohdejoukko_24#1',
      label: '24 Lukiokoulutus'
    }
  ]
});

const getOptions = () => getState(APP_STATE_VALINTAPERUSTEEN_KOHDEJOUKKO, 'options');

export const selectOption = (change) => updateState(APP_STATE_VALINTAPERUSTEEN_KOHDEJOUKKO, {
  options: updateSingleSelectionOptionActivation(getOptions(), change)
});

