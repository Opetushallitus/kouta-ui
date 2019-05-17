import { getSoraKuvausByValues, getValuesBySoraKuvaus } from '../utils';
import { parse as parseEditor } from '../../../components/Editor';

test('getSoraKuvausByValues returns correct SoraKuvaus given form values', () => {
  const soraKuvaus = getSoraKuvausByValues({
    kieliversiot: ['fi', 'sv'],
    tiedot: {
      nimi: {
        fi: 'Fi nimi',
        sv: 'Sv nimi',
      },
      kuvaus: {
        fi: parseEditor('<b>Kuvaus fi</b>'),
        sv: parseEditor('<i>Kuvaus sv</i>'),
      },
    },
    julkisuus: true,
    koulutustyyppi: 'amm',
  });

  expect(soraKuvaus).toMatchSnapshot();
});

test('getValuesBySoraKuvaus returns correct form values given soraKuvaus', () => {
  const values = getValuesBySoraKuvaus({
    kieliversiot: ['fi', 'sv'],
    nimi: {
      fi: 'Fi nimi',
      sv: 'Sv nimi',
    },
    metadata: {
      kuvaus: {
        fi: '<b>Kuvaus fi</b>',
        sv: '<i>Kuvaus sv</i>',
      },
    },
    julkinen: true,
    koulutustyyppi: 'amm',
  });

  expect(values).toMatchSnapshot();
});
