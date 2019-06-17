import getKoulutusByFormValues from '../getKoulutusByFormValues';

test('getKoulutusByFormValues returns correct koulutus given form values', () => {
  const koulutus = getKoulutusByFormValues({
    kieliversiot: ['fi', 'sv'],
    tarjoajat: ['123.456.789'],
    information: {
      nimi: {
        fi: 'Fi nimi',
        sv: 'Sv nimi',
      },
      koulutus: {
        value: 'koulutuskoodi_1#1',
      },
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
          fi: 'Fi kuvaus',
          sv: 'Sv kuvaus',
        },
      },
      osiot: [{ value: 'osio_1#1' }, { value: 'osio_2#1' }],
    },
    description: {
      kuvaus: {
        fi: 'Fi kuvaus',
        sv: 'Sv kuvaus',
      },
      nimi: {
        fi: 'Fi nimi',
        sv: 'Sv nimi',
      },
    },
    julkinen: true,
  });

  expect(koulutus).toMatchSnapshot();
});
