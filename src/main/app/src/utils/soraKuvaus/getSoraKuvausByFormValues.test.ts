import getSoraKuvausByFormValues from '#/src/utils/soraKuvaus/getSoraKuvausByFormValues';
import { parseEditorState } from '#/src/components/Editor/utils';

test('getSoraKuvausByFormValues returns correct sora-kuvaus given form values', () => {
  const soraKuvaus = getSoraKuvausByFormValues({
    tila: 'tallennettu',
    muokkaaja: '1.1.1.1',
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
    julkinen: true,
    koulutustyyppi: 'amm',
  });

  expect(soraKuvaus).toMatchSnapshot();
});
