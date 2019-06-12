module.exports = {
  createKoulutusForm: {
    'should be able to create ammatillinen koulutus': {
      '1': {
        organisaatioOid: '1.1.1.1.1.1',
        muokkaaja: '1.2.246.562.24.62301161440',
        tila: 'julkaistu',
        johtaaTutkintoon: true,
        kielivalinta: ['fi'],
        tarjoajat: ['4.1.1.1.1.1', '5.1.1.1.1.1'],
        koulutusKoodiUri: 'koulutus_0#1',
        koulutustyyppi: 'amm',
        nimi: {
          fi: 'Nimi',
        },
        julkinen: false,
        metadata: {
          tyyppi: 'amm',
          lisatiedot: [
            {
              otsikkoKoodiUri: 'koulutuksenlisatiedot_0#1',
              teksti: {
                fi: 'koulutuksenlisatiedot_0 kuvaus',
              },
            },
          ],
          kuvaus: {},
          opintojenLaajuusKoodiUri: null,
          tutkintonimikeKoodiUrit: [],
          kuvauksenNimi: {},
          koulutusalaKoodiUrit: [],
        },
      },
    },
    'should be able to create korkeakoulu koulutus': {
      '1': {
        organisaatioOid: '1.1.1.1.1.1',
        muokkaaja: '1.2.246.562.24.62301161440',
        tila: 'julkaistu',
        johtaaTutkintoon: true,
        kielivalinta: ['fi'],
        tarjoajat: ['4.1.1.1.1.1', '5.1.1.1.1.1'],
        koulutusKoodiUri: 'koulutus_0#1',
        koulutustyyppi: 'yo',
        nimi: {
          fi: 'Tiedot nimi',
        },
        julkinen: true,
        metadata: {
          tyyppi: 'yo',
          lisatiedot: [
            {
              otsikkoKoodiUri: 'koulutuksenlisatiedot_0#1',
              teksti: {
                fi: 'koulutuksenlisatiedot_0 kuvaus',
              },
            },
          ],
          kuvaus: {
            fi: 'Kuvaus',
          },
          opintojenLaajuusKoodiUri: 'opintojenlaajuus_0#1',
          tutkintonimikeKoodiUrit: ['tutkintonimikekk_0#1'],
          kuvauksenNimi: {
            fi: 'Kuvauksen nimi',
          },
          koulutusalaKoodiUrit: [
            'kansallinenkoulutusluokitus2016koulutusalataso2_0#1',
          ],
        },
      },
    },
  },
  __version: '3.2.0',
  editKoulutusForm: {
    'should be able to edit ammatillinen koulutus': {
      '1': {
        oid: '1.2.3.4.5.6',
        koulutustyyppi: 'amm',
        koulutusKoodiUri: 'koulutus_0#1',
        tila: 'tallennettu',
        tarjoajat: ['4.1.1.1.1.1', '2.1.1.1.1.1'],
        nimi: {
          fi: 'Maatalousalan perustutkinto',
        },
        metadata: {
          tyyppi: 'amm',
          lisatiedot: [
            {
              otsikkoKoodiUri: 'koulutuksenlisatiedot_0#1',
              teksti: {
                fi: 'koulutuksenlisatiedot_0 kuvaus',
              },
            },
          ],
          kuvaus: {},
          opintojenLaajuusKoodiUri: null,
          tutkintonimikeKoodiUrit: [],
          kuvauksenNimi: {},
          koulutusalaKoodiUrit: [],
        },
        julkinen: false,
        muokkaaja: '1.2.246.562.24.62301161440',
        organisaatioOid: '1.1.1.1.1.1',
        kielivalinta: ['fi'],
        modified: '2019-04-01T13:01',
      },
    },
    'should be able to edit korkeakoulu koulutus': {
      '1': {
        oid: '1.2.3.4.5.6',
        koulutustyyppi: 'yo',
        koulutusKoodiUri: 'koulutus_0#1',
        tila: 'tallennettu',
        tarjoajat: ['4.1.1.1.1.1', '2.1.1.1.1.1'],
        nimi: {
          fi: 'Fi nimi',
        },
        metadata: {
          tyyppi: 'yo',
          lisatiedot: [
            {
              otsikkoKoodiUri: 'koulutuksenlisatiedot_0#1',
              teksti: {
                fi: 'koulutuksenlisatiedot_0 kuvaus',
              },
            },
          ],
          kuvaus: {
            fi: 'Fi kuvaus',
          },
          opintojenLaajuusKoodiUri: 'opintojenlaajuus_1#1',
          tutkintonimikeKoodiUrit: [
            'tutkintonimikekk_1#1',
            'tutkintonimikekk_2#1',
          ],
          kuvauksenNimi: {
            fi: 'Fi kuvauksen nimi',
          },
          koulutusalaKoodiUrit: [
            'kansallinenkoulutusluokitus2016koulutusalataso2_1#1',
          ],
        },
        julkinen: true,
        muokkaaja: '1.2.246.562.24.62301161440',
        organisaatioOid: '1.1.1.1.1.1',
        kielivalinta: ['fi'],
        modified: '2019-04-01T13:01',
        johtaaTutkintoon: true,
      },
    },
  },
};
