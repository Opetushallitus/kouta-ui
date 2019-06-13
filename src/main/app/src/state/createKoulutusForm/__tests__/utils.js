import { getKoulutusByValues, getValuesByKoulutus } from '../utils';

test('getKoulutusByValues returns correct koulutus given form values', () => {
  const koulutus = getKoulutusByValues({
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

test('getValuesByKoulutus returns correct form values given koulutus', () => {
  const values = getValuesByKoulutus({
    julkinen: true,
    kielivalinta: ['fi', 'sv'],
    koulutusKoodiUri: 'koulutuskoodi_1#1',
    koulutustyyppi: 'yo',
    metadata: {
      kuvauksenNimi: {
        fi: 'Fi nimi',
        sv: 'Sv nimi',
      },
      kuvaus: {
        fi: 'Fi kuvaus',
        sv: 'Sv kuvaus',
      },
      lisatiedot: [
        {
          otsikkoKoodiUri: 'osio_1#1',
          teksti: {},
        },
        {
          otsikkoKoodiUri: 'osio_2#1',
          teksti: {
            fi: 'Fi kuvaus',
            sv: 'Sv kuvaus',
          },
        },
      ],
      opintojenLaajuusKoodiUri: 'laajuus_1#1',
      tutkintonimikeKoodiUrit: ['nimike_1#1', 'nimike_2#1'],
      tyyppi: 'yo',
      koulutusalaKoodiUrit: ['koulutusala_1#1', 'koulutusala_2#1'],
    },
    nimi: {
      fi: 'Fi nimi',
      sv: 'Sv nimi',
    },
    tarjoajat: ['123.456.789'],
  });

  expect(values).toMatchSnapshot();
});
