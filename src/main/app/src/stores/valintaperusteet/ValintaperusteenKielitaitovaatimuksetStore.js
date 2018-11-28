import {getState, setState, updateState} from '../../utils/stateUtils';
import {
  updateMultiSelectionOptionActivation,
  updateOptionValue,
  updateSingleSelectionOptionActivation
} from '../../utils/optionListUtils';

export const APP_STATE_VALINTAPERUSTEEN_KIELITAITOVAATIMUKSET = 'APP_STATE_VALINTAPERUSTEEN_KIELITAITOVAATIMUKSET';

export const ValintaperusteenKielitaitovaatimuksetStore = () => setState(APP_STATE_VALINTAPERUSTEEN_KIELITAITOVAATIMUKSET, getInitialState());

export const clearSelections = () => setState(APP_STATE_VALINTAPERUSTEEN_KIELITAITOVAATIMUKSET, getInitialState());

const getInitialState = () => ({
  kielitutkintoOptions: [
    {
      key: 'yleinen-kielitutkinto',
      label: 'Yleinen kielitutkinto',
      content: {
        vaadittuKuvaus1: {
          options: [
            {
              key: 'vaadittu-yleinen-kuvaus-1-a',
              label: 'Vaadittu yleinen kuvaus 1a'
            },
            {
              key: 'vaadittu-yleinen-kuvaus-1-b',
              label: 'Vaadittu yleinen kuvaus 1b'
            },
            {
              key: 'vaadittu-yleinen-kuvaus-1-c',
              label: 'Vaadittu yleinen kuvaus 1c'
            }
          ],
          taso: ''
        },
        vaadittuKuvaus2: {
          options: [
            {
              key: 'vaadittu-yleinen-kuvaus-2-a',
              label: 'Vaadittu yleinen kuvaus 2a'
            },
            {
              key: 'vaadittu-yleinen-kuvaus-2-b',
              label: 'Vaadittu yleinen kuvaus 2b'
            },
            {
              key: 'vaadittu-yleinen-kuvaus-2-c',
              label: 'Vaadittu yleinen kuvaus 2c'
            }
          ],
          taso: ''
        }
      }
    },
    {
      key: 'toefl',
      label: 'TOEFL',
      content: {
        vaadittuKuvaus1: {
          options: [
            {
              key: 'vaadittu-toefl-kuvaus-1-a',
              label: 'Vaadittu TOEFL kuvaus 1a'
            },
            {
              key: 'vaadittu-toefl-kuvaus-1-b',
              label: 'Vaadittu TOEFL kuvaus 1b'
            },
            {
              key: 'vaadittu-toefl-kuvaus-1-c',
              label: 'Vaadittu TOEFL kuvaus 1c'
            }
          ],
          taso: ''
        },
        vaadittuKuvaus2: {
          options: [
            {
              key: 'vaadittu-toefl-kuvaus-2-a',
              label: 'Vaadittu TOEFL kuvaus 2a'
            },
            {
              key: 'vaadittu-toefl-kuvaus-2-b',
              label: 'Vaadittu TOEFL kuvaus 2b'
            },
            {
              key: 'vaadittu-toefl-kuvaus-2-c',
              label: 'Vaadittu TOEFL kuvaus 2c'
            }
          ],
          taso: ''
        }
      }
    },
    {
      key: 'ielts',
      label: 'IELTS (Academic IELTS only)',
      content: {
        vaadittuKuvaus1: {
          options: [
            {
              key: 'vaadittu-ielts-kuvaus-1-a',
              label: 'Vaadittu IELTS kuvaus 1a'
            },
            {
              key: 'vaadittu-ielts-kuvaus-1-b',
              label: 'Vaadittu IELTS kuvaus 1b'
            },
            {
              key: 'vaadittu-ielts-kuvaus-1-c',
              label: 'Vaadittu IELTS kuvaus 1c'
            }
          ],
          taso: ''
        },
        vaadittuKuvaus2: {
          options: [
            {
              key: 'vaadittu-ielts-kuvaus-2-a',
              label: 'Vaadittu IELTS kuvaus 1a'
            },
            {
              key: 'vaadittu-ielts-kuvaus-2-b',
              label: 'Vaadittu IELTS kuvaus 2b'
            },
            {
              key: 'vaadittu-ielts-kuvaus-2-c',
              label: 'Vaadittu IELTS kuvaus 2c'
            }
          ],
          taso: ''
        }
      }
    },
    {
      key: 'cae-cpe',
      label: 'CAE/CPE',
      content: {
        vaadittuKuvaus1: {
          options: [
            {
              key: 'vaadittu-cap-cpe-kuvaus-1-a',
              label: 'Vaadittu CAP/CPE kuvaus 1a'
            },
            {
              key: 'vaadittu-cap-cpe-kuvaus-1-b',
              label: 'Vaadittu CAP/CPE kuvaus 1b'
            },
            {
              key: 'vaadittu-cap-cpe-kuvaus-1-c',
              label: 'Vaadittu CAP/CPE kuvaus 1c'
            }
          ],
          taso: ''
        },
        vaadittuKuvaus2: {
          options: [
            {
              key: 'vaadittu-cap-cpe-kuvaus-2-a',
              label: 'Vaadittu CAP/CPE kuvaus 2a'
            },
            {
              key: 'vaadittu-cap-cpekuvaus-2-b',
              label: 'Vaadittu CAP/CPE kuvaus 2b'
            },
            {
              key: 'vaadittu-cap-cpe-kuvaus-2-c',
              label: 'Vaadittu CAP/CPE kuvaus 2c'
            }
          ],
          taso: ''
        }
      }
    }
  ],
  kielitaitoOptions: [
    {
      key: 'kk-tutkinto-suomessa',
      label: 'kk-tutkinto Suomeessa (Suomeksi, ruotsiksi tai englanniksi)'
    },
    {
      key: 'kk-tutkinto-englanniksi-eu-eta-maassa',
      label: 'kk-tutkinto englanniksi EU/ETA-maassa'
    },
    {
      key: 'kk-tutkinto-muualla',
      label: 'kk-tutkinto englanniksi paikan päällä suoritetttuna jossain seuraavista maista: USA, Kanada, Irlanti, USA, Kanada, Australia, Irlanti, Uusi-Seelanti'
    },
    {
      key: 'muu-kielitaito:',
      label: 'Muu, mikä',
      input: {
        placeholder: 'Valitse vaadittu kuvaus'
      }
    }
  ]
});

const getKielitutkintoOptions = () => getState(APP_STATE_VALINTAPERUSTEEN_KIELITAITOVAATIMUKSET, 'kielitutkintoOptions');

const getKielitaitoOptions = () => getState(APP_STATE_VALINTAPERUSTEEN_KIELITAITOVAATIMUKSET, 'kielitaitoOptions');

export const selectKielitutkinto = (change) => updateState(APP_STATE_VALINTAPERUSTEEN_KIELITAITOVAATIMUKSET, {
  kielitutkintoOptions: updateSingleSelectionOptionActivation(getKielitutkintoOptions(), change)
});

export const selectKielitaito = (change) => updateState(APP_STATE_VALINTAPERUSTEEN_KIELITAITOVAATIMUKSET, {
  kielitaitoOptions: updateMultiSelectionOptionActivation(getKielitaitoOptions(), change)
});

export const updateCustomKielitaito = (change) => updateState(APP_STATE_VALINTAPERUSTEEN_KIELITAITOVAATIMUKSET, {
  kielitaitoOptions: updateOptionValue(getKielitaitoOptions(), change)
});

export const updateTaso = (dataId, value) => {
  //console.log()
  //updateState(APP_STATE_VALINTAPERUSTEEN_KIELITAITOVAATIMUKSET, '')
};
