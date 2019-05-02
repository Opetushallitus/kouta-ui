module.exports = {
  createHakuForm: {
    'should be able to create haku': {
      '1': {
        organisaatioOid: '1.1.1.1.1.1',
        muokkaaja: '1.2.246.562.24.62301161440',
        tila: 'julkaistu',
        alkamiskausiKoodiUri: 'kausi_0#1',
        kielivalinta: ['fi'],
        hakutapaKoodiUri: 'hakutapa_0#1',
        hakuajat: [
          {
            alkaa: '2019-04-02T10:45',
            paattyy: '2019-11-25T23:59',
          },
        ],
        hakukohteenLiittamisenTakaraja: '2019-12-24T21:20',
        nimi: {
          fi: 'haun nimi',
        },
        kohdejoukkoKoodiUri: 'haunkohdejoukko_0#1',
        kohdejoukonTarkenneKoodiUri: null,
        hakulomaketyyppi: null,
        metadata: {
          tulevaisuudenAikataulu: [
            {
              alkaa: '2019-10-11T09:05',
              paattyy: '2019-12-25T20:30',
            },
          ],
          yhteystieto: {
            nimi: {
              fi: 'nimi',
            },
            titteli: {
              fi: 'titteli',
            },
            sahkoposti: {
              fi: 'sähkoposti',
            },
            puhelinnumero: {
              fi: 'puhelin',
            },
          },
        },
        hakukohteenMuokkaamisenTakaraja: '2019-12-11T19:15',
        ajastettuJulkaisu: '2019-12-05T06:45',
        alkamisvuosi: 2019,
        hakulomake: null,
      },
    },
  },
  __version: '3.2.0',
  editHakuForm: {
    'should be able to edit haku': {
      '1': {
        oid: '2.1.1.1.1.1',
        muokkaaja: '1.2.246.562.24.62301161440',
        tila: 'tallennettu',
        organisaatioOid: '1.1.1.1.1.1',
        alkamiskausiKoodiUri: 'kausi_0#1',
        kielivalinta: ['fi'],
        hakutapaKoodiUri: 'hakutapa_0#1',
        hakuajat: [
          {
            alkaa: '2019-02-08T07:05',
            paattyy: '2020-02-08T07:05',
          },
        ],
        hakukohteenLiittamisenTakaraja: '2019-02-08T07:05',
        nimi: {
          fi: 'Haku',
        },
        kohdejoukkoKoodiUri: 'haunkohdejoukko_0#1',
        kohdejoukonTarkenneKoodiUri: null,
        hakulomaketyyppi: 'ataru',
        metadata: {
          tulevaisuudenAikataulu: [
            {
              alkaa: '2019-10-11T09:05',
              paattyy: '2019-12-25T20:30',
            },
          ],
          yhteystieto: {
            nimi: {
              fi: 'nimi',
            },
            titteli: {
              fi: 'titteli',
            },
            sahkoposti: {
              fi: 'sähkoposti',
            },
            puhelinnumero: {
              fi: 'puhelin',
            },
          },
        },
        hakukohteenMuokkaamisenTakaraja: '2019-02-08T07:05',
        ajastettuJulkaisu: '2019-12-05T06:45',
        alkamisvuosi: 2024,
        hakulomake: null,
      },
    },
  },
};
