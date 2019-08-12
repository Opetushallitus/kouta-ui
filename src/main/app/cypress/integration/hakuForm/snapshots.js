module.exports = {
  createHakuForm: {
    'should be able to create haku': {
      '1': {
        organisaatioOid: '1.1.1.1.1.1',
        muokkaaja: '1.2.246.562.24.62301161440',
        tila: 'julkaistu',
        alkamiskausiKoodiUri: 'kausi_0#1',
        kielivalinta: ['fi'],
        hakutapaKoodiUri: 'hakutapa_01#1',
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
        kohdejoukkoKoodiUri: 'haunkohdejoukko_12#1',
        kohdejoukonTarkenneKoodiUri: 'haunkohdejoukontarkenne_0#1',
        hakulomaketyyppi: 'ataru',
        metadata: {
          tulevaisuudenAikataulu: [
            {
              alkaa: '2019-10-11T09:05',
              paattyy: '2019-12-25T20:30',
            },
          ],
          yhteyshenkilot: [
            {
              nimi: {
                fi: 'nimi',
              },
              titteli: {
                fi: 'titteli',
              },
              puhelinnumero: {
                fi: 'puhelin',
              },
              wwwSivu: {
                fi: 'verkkosivu',
              },
              sahkoposti: {
                fi: 'sähkoposti',
              },
            },
          ],
        },
        hakukohteenMuokkaamisenTakaraja: '2019-12-11T19:15',
        ajastettuJulkaisu: '2019-12-05T06:45',
        alkamisvuosi: 2019,
        hakulomakeAtaruId: 'lomake_1',
        hakulomakeLinkki: {},
        hakulomakeKuvaus: {},
        valintakokeet: [
          {
            tyyppi: 'valintakokeentyyppi_1#1',
            tilaisuudet: [
              {
                osoite: {
                  osoite: {
                    fi: 'osoite',
                  },
                  postinumero: '00510',
                  postitoimipaikka: {
                    fi: 'postitoimipaikka',
                  },
                },
                aika: {
                  alkaa: '2019-04-02T10:45',
                  paattyy: '2019-04-02T19:00',
                },
                lisatietoja: {
                  fi: 'lisatietoja',
                },
              },
            ],
          },
        ],
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
          yhteyshenkilot: [
            {
              nimi: {
                fi: 'nimi',
              },
              titteli: {
                fi: 'titteli',
              },
              puhelinnumero: {
                fi: 'puhelin',
              },
              wwwSivu: {
                fi: 'verkkosivu',
              },
              sahkoposti: {
                fi: 'sähkoposti',
              },
            },
          ],
        },
        hakukohteenMuokkaamisenTakaraja: '2019-02-08T07:05',
        ajastettuJulkaisu: '2019-12-05T06:45',
        alkamisvuosi: 2024,
        hakulomakeAtaruId: '12345',
        hakulomakeLinkki: {},
        hakulomakeKuvaus: {},
        valintakokeet: [
          {
            tyyppi: 'valintakokeentyyppi_1#1',
            tilaisuudet: [
              {
                osoite: {
                  osoite: {
                    fi: 'osoite',
                  },
                  postinumero: '00510',
                  postitoimipaikka: {
                    fi: 'postitoimipaikka',
                  },
                },
                aika: {
                  alkaa: '2019-04-02T10:45',
                  paattyy: '2019-04-02T19:00',
                },
                lisatietoja: {
                  fi: 'lisatietoja',
                },
              },
            ],
          },
        ],
      },
      '2': {
        oid: '2.1.1.1.1.1',
        tila: 'tallennettu',
        nimi: {
          fi: 'Haku',
        },
        hakutapaKoodiUri: 'hakutapa_0#1',
        hakukohteenLiittamisenTakaraja: '2019-02-08T07:05',
        hakukohteenMuokkaamisenTakaraja: '2019-02-08T07:05',
        alkamiskausiKoodiUri: 'kausi_0#1',
        alkamisvuosi: 2024,
        kohdejoukkoKoodiUri: 'haunkohdejoukko_0#1',
        kohdejoukonTarkenneKoodiUri: 'haunkohdejoukontarkenne_0#1',
        hakulomaketyyppi: 'ataru',
        hakulomakeAtaruId: '12345',
        hakulomakeKuvaus: {},
        hakulomakeLinkki: {},
        metadata: {
          tulevaisuudenAikataulu: [
            {
              alkaa: '2019-10-11T09:05',
              paattyy: '2019-12-25T20:30',
            },
          ],
          yhteyshenkilot: [
            {
              nimi: {
                fi: 'nimi',
              },
              titteli: {
                fi: 'titteli',
              },
              puhelinnumero: {
                fi: 'puhelin',
              },
              wwwSivu: {
                fi: 'verkkosivu',
              },
              sahkoposti: {
                fi: 'sähkoposti',
              },
            },
          ],
        },
        organisaatioOid: '1.1.1.1.1.1',
        hakuajat: [
          {
            alkaa: '2019-02-08T07:05',
            paattyy: '2020-02-08T07:05',
          },
        ],
        ajastettuJulkaisu: '2019-12-05T06:45',
        muokkaaja: '1.2.246.562.24.62301161440',
        kielivalinta: ['fi'],
        valintakokeet: [
          {
            tyyppi: 'valintakokeentyyppi_1#1',
            tilaisuudet: [
              {
                osoite: {
                  osoite: {
                    fi: 'osoite',
                  },
                  postinumero: '00510',
                  postitoimipaikka: {
                    fi: 'postitoimipaikka',
                  },
                },
                aika: {
                  alkaa: '2019-04-02T10:45',
                  paattyy: '2019-04-02T19:00',
                },
                lisatietoja: {
                  fi: 'lisatietoja',
                },
              },
            ],
          },
        ],
      },
    },
  },
};
