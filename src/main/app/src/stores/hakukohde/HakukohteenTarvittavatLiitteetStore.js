import {initState, setState} from '../../utils/stateUtils';

export const APP_STATE_HAKUKOHTEEN_TARVITTAVAT_LIITTEET = 'APP_STATE_HAKUKOHTEEN_TARVITTAVAT_LIITTEET';

export const HakukohteenTarvittavatLiitteetStore = () => initState(APP_STATE_HAKUKOHTEEN_TARVITTAVAT_LIITTEET, getInitialState());

export const clearSelections = () => setState(APP_STATE_HAKUKOHTEEN_TARVITTAVAT_LIITTEET, getInitialState());

const getInitialState = () => ({
  liitteenTyyppiOptions: [
    {
      key: 'tutkintotodistus',
      label: 'Tutkintotodistus'
    },
    {
      key: 'muu-liitteen-tyyppi-1',
      label: 'Muu liitteen tyyppi 1'
    },
    {
      key: 'muu-liitteen-tyyppi-2',
      label: 'Muu liitteen tyyppi 2'
    },
    {
      key: 'muu-liitteen-tyyppi-3',
      label: 'Muu liitteen tyyppi 3'
    }
  ],
  liitteenNimiOptions: [
    {
      key: 'ylioppilastodistus-ennen-vuotta-1990',
      label: 'Ylioppilastodistus ennen vuotta 1990'
    },
    {
      key: 'muu-liitteen-nimi-1',
      label: 'Muu liitteen nimi 1'
    },
    {
      key: 'muu-liitteen-nimi-2',
      label: 'Muu liitteen nimi 2'
    },
    {
      key: 'muu-liitteen-nimi-3',
      label: 'Muu liitteen nimi 3'
    }
  ],
  liitteenKuvaus: '',
  liitteenTakaraja: {
    date: '',
    time: ''
  },
  samaOsoiteKaikissaLiitteissa: false,
  toimitusosoiteOptions: [
    {
      key: 'hakijapalvelun-osoite',
      label: 'Koulutuksen järjestäjän hakijapalvelun osoite'
    },
    {
      key: 'tonen-toimitusosoite',
      label: 'Toinen toimitusosoite'
    }
  ]
});
