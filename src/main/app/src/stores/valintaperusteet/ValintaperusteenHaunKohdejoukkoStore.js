import {initState, setState} from '../../utils/stateUtils';

export const APP_STATE_VALINTAPERUSTEEN_HAUN_KOHDEJOUKKO = 'APP_STATE_VALINTAPERUSTEEN_HAUN_KOHDEJOUKKO';

export const ValintaperusteenHaunKohdejoukkoStore = () => initState(APP_STATE_VALINTAPERUSTEEN_HAUN_KOHDEJOUKKO, getInitialState());

export const clearSelections = () => setState(APP_STATE_VALINTAPERUSTEEN_HAUN_KOHDEJOUKKO, getInitialState());

//TODO: check if there is API for this && implement as API request
const getInitialState = () => ({
  options: [
    {
      key: '10-aikuiskoulutus',
      label : '10 Aikuiskoulutus'
    },
    {
      key: '11-ammatillinen-koulutus-ja-lukiokoulutus',
      label : '11 Ammatillinen koulutus ja lukiokoulutus'
    },
    {
      key: '12-korkeakoulutus',
      label : '12 Korkeakoulutus'
    },
    {
      key: '13-taydennyskoulutus',
      label : '13 Täydennyskoulutus'
    },
    {
      key: '14-vapaa-sivistystyo',
      label : '14 Vapaa sivistystyö'
    },
    {
      key: '15-ammatillinen-peruskoulutus-erityisopetuksena',
      label : '15 Ammatillinen peruskoulutus erityisopetuksena'
    },
    {
      key: '16-valmentava-ja-kuntouttava-koulutus',
      label : '16 Valmentava ja kuntouttava koulutus'
    },
    {
      key: '17-perusopetuksen-jalkeinen-valmistava-koulutus',
      label : '17 Perusopetuksen jälkeinen valmistava koulutus'
    },
    {
      key: '18-vapaan-sivistystyon-koulutus',
      label : '18 Vapaan sivistystyön koulutus'
    },
    {
      key: '19-aikuisten-perusopetus',
      label : '19 Aikuisten perusopetus'
    },
    {
      key: '20-erityisopetuksena-jarjestettava-ammatillinen-koulutus',
      label : '20 Erityisopetuksena järjestettävä ammatillinen koulutus'
    },
    {
      key: '21-yhteishaun-ulkopuolinen-lukiokoulutus',
      label : '21 Yhteishaun ulkopuolinen lukiokoulutus'
    },
    {
      key: '22-pelastusalan-koulutus',
      label : '22 Pelastusalan koulutus'
    },
    {
      key: '23-ammatillinen-koulutus',
      label : '23 Ammatillinen koulutus'
    },
    {
      key: '24-lukiokoulutus',
      label: '24 Lukiokoulutuss'
    }
  ]
});
