import { getSoraKuvausByValues, getValuesBySoraKuvaus } from '../utils';
import parseEditorState from '../../../utils/draft/parseEditorState';

test('getSoraKuvausByValues returns correct SoraKuvaus given form values', () => {
  const soraKuvaus = getSoraKuvausByValues({
    kieliversiot: ['fi', 'sv'],
    tiedot: {
      nimi: {
        fi: 'Fi nimi',
        sv: 'Sv nimi',
      },
      kuvaus: {
        fi: parseEditorState('<b>Kuvaus fi</b>'),
        sv: parseEditorState('<i>Kuvaus sv</i>'),
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
