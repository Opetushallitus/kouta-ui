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
    koulutusala: {
      value: 'kansallinenkoulutusluokitus2016koulutusalataso2_073#1',
      label: 'Arkkitehtuuri ja rakentaminen',
    },
    koulutukset: [
      {
        value: 'koulutus_754101#7',
        label: 'Arkkitehti',
      },
    ],
  });

  expect(soraKuvaus).toMatchSnapshot();
});
