import getFormValuesByKoulutus from '#/src/utils/koulutus/getFormValuesByKoulutus';

test('getFormValuesByKoulutus returns correct form values given koulutus', () => {
  const values = getFormValuesByKoulutus({
    tila: 'tallennettu',
    julkinen: true,
    kielivalinta: ['fi', 'sv'],
    koulutuksetKoodiUri: ['koulutus_371101#1', 'koulutus_201000#1'],
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
    sorakuvausId: '1234',
  });

  expect(values).toMatchSnapshot();
});

test('getFormValuesByKoulutus returns correct form values for ammatillinen koulutus', () => {
  const values = getFormValuesByKoulutus({
    tila: 'tallennettu',
    julkinen: true,
    kielivalinta: ['fi', 'sv'],
    koulutuksetKoodiUri: ['koulutus_371101#1'],
    koulutustyyppi: 'amm',
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
      tyyppi: 'amm',
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
