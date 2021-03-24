import { parseEditorState } from '#/src/components/Editor/utils';
import getKoulutusByFormValues from '#/src/utils/koulutus/getKoulutusByFormValues';

test('getKoulutusByFormValues returns correct koulutus given form values', () => {
  const koulutus = getKoulutusByFormValues({
    tila: 'tallennettu',
    muokkaaja: '1.1.1.1',
    kieliversiot: ['fi', 'sv'],
    tarjoajat: {
      tarjoajat: ['123.456.789'],
    },
    information: {
      nimi: {
        fi: 'Fi nimi',
        sv: 'Sv nimi',
      },
      koulutus: {
        value: 'koulutuskoodi_1#1',
      },
      korkeakoulutukset: ['koulutus_371101#1', 'koulutus_201000#1'],
      opintojenLaajuus: {
        value: 'laajuus_1#1',
      },
      tutkintonimike: [{ value: 'nimike_1#1' }, { value: 'nimike_2#1' }],
      koulutusalat: [
        { value: 'koulutusala_1#1' },
        { value: 'koulutusala_2#1' },
      ],
    },
    koulutustyyppi: 'yo',
    lisatiedot: {
      osioKuvaukset: {
        'osio_1#1': {},
        'osio_2#1': {
          fi: parseEditorState('Fi kuvaus'),
          sv: parseEditorState('Sv kuvaus'),
        },
      },
      osiot: [{ value: 'osio_1#1' }, { value: 'osio_2#1' }],
    },
    description: {
      kuvaus: {
        fi: parseEditorState('Fi kuvaus'),
        sv: parseEditorState('Sv kuvaus'),
      },
      nimi: {
        fi: 'Fi nimi',
        sv: 'Sv nimi',
      },
    },
    tutkinnonosat: {
      osat: [
        {
          eperuste: { value: '1234' },
          koulutus: { value: 'koulutuskoodi_2#1' },
          tutkinnonosa: { value: '567567' },
          tutkinnonosaviite: '9847598475',
        },
      ],
    },
    julkinen: true,
  });

  expect(koulutus).toMatchSnapshot();
});
