module.exports = {
  __version: '3.2.0',
  createHakuForm: {
    'should be able to create sora-kuvaus': {
      '1': {
        organisaatioOid: '1.1.1.1.1.1',
        muokkaaja: '1.2.246.562.24.62301161440',
        tila: 'julkaistu',
        nimi: {
          fi: 'Nimi',
        },
        julkinen: true,
        koulutustyyppi: 'amm',
        kielivalinta: ['fi'],
        metadata: {
          kuvaus: {
            fi: '<p>Kuvaus</p>',
          },
        },
      },
    },
  },
  editSoraKuvausForm: {
    'should be able to edit sora-kuvaus': {
      '1': {
        id: '123e4567-e89b-12d3-a456-426655440000',
        tila: 'tallennettu',
        julkinen: false,
        muokkaaja: '1.2.246.562.24.62301161440',
        organisaatioOid: '1.1.1.1.1.1',
        kielivalinta: ['fi'],
        modified: '2019-04-01T13:01',
        koulutustyyppi: 'amm',
        metadata: {
          kuvaus: {
            fi: '<p><strong>Kuvaus fi</strong></p>',
          },
        },
        nimi: {
          fi: 'Fi nimi',
        },
      },
    },
  },
};
