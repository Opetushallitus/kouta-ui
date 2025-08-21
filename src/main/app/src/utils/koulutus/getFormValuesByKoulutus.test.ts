import getFormValuesByKoulutus from '#/src/utils/koulutus/getFormValuesByKoulutus';

test('getFormValuesByKoulutus returns correct form values given koulutus', () => {
  const values = getFormValuesByKoulutus({
    externalId: 'ext1',
    tila: 'tallennettu',
    julkinen: true,
    kielivalinta: ['fi', 'sv'],
    koulutuksetKoodiUri: ['koulutus_371101#1', 'koulutus_201000#1'],
    koulutustyyppi: 'yo',
    metadata: {
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
      tutkintonimikeKoodiUrit: ['nimike_1#1', 'nimike_2#1'],
      tyyppi: 'amm',
      koulutusalaKoodiUrit: ['koulutusala_1#1', 'koulutusala_2#1'],
      luokittelutermit: ['term1', 'term2'],
    },
    nimi: {
      fi: 'Fi nimi',
      sv: 'Sv nimi',
    },
    tarjoajat: ['123.456.789'],
  });

  expect(values).toMatchSnapshot();
});

test('getFormValuesByKoulutus returns correct form values for erikoistumiskoulutus', () => {
  const values = getFormValuesByKoulutus({
    koulutustyyppi: 'erikoistumiskoulutus',
    metadata: {
      kuvaus: {
        fi: 'Fi kuvaus',
        sv: 'Sv kuvaus',
      },
      osaamistavoitteet: {
        fi: 'Fi osaamistavoitteet',
        sv: 'Sv osaamistavoitteet',
      },
      erikoistumiskoulutusKoodiUri: 'erikoistumiskoulutukset_001#2',
      opintojenLaajuusyksikko: 'opintojenlaajuusyksikko_2#1',
      opintojenLaajuusNumeroMax: 10,
      opintojenLaajuusNumeroMin: 5,
      koulutusalaKoodiUrit: ['koulutusala_1#1', 'koulutusala_2#1'],
    },
  });

  expect(values).toMatchSnapshot();
});
