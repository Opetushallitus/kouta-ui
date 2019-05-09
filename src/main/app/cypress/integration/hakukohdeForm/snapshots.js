module.exports = {
  createHakukohdeForm: {
    'should be able to create hakukohde': {
      '1': {
        alkamiskausiKoodiUri: 'kausi_0#1',
        kaytetaanHaunAikataulua: false,
        kielivalinta: ['fi'],
        aloituspaikat: 100,
        hakuajat: [
          {
            alkaa: '2019-04-02T10:45',
            paattyy: '2019-11-25T23:59',
          },
        ],
        liitteetOnkoSamaToimitusaika: false,
        liitteetOnkoSamaToimitusosoite: false,
        liitteet: [
          {
            tyyppi: 'liitetyypitamm_0#1',
            nimi: {
              fi: 'Nimi',
            },
            toimitusaika: '2019-11-25T23:59',
            toimitusosoite: {
              osoite: {
                osoite: {
                  fi: 'Osoite',
                },
                postinumero: '00940',
                postitoimipaikka: {
                  fi: 'Helsinki',
                },
              },
              sahkoposti: 'sahkoposti@email.com',
            },
            kuvaus: {
              fi: 'Kuvaus',
            },
          },
        ],
        alkamisvuosi: 2019,
        liitteidenToimitusosoite: {
          osoite: {
            osoite: {
              fi: '',
            },
            postinumero: null,
            postitoimipaikka: {
              fi: '',
            },
          },
          sahkoposti: null,
        },
        liitteidenToimitusaika: null,
        nimi: {
          fi: 'Hakukohteen nimi',
        },
        toinenAsteOnkoKaksoistutkinto: false,
        valintakokeet: [
          {
            tyyppi: 'valintakokeentyyppi_0#1',
            tilaisuudet: [
              {
                osoite: {
                  osoite: {
                    fi: 'Osoite',
                  },
                  postinumero: '00940',
                  postitoimipaikka: {
                    fi: 'Helsinki',
                  },
                },
                aika: {
                  alkaa: '2019-04-02T10:45',
                  paattyy: '2019-11-25T23:59',
                },
                lisatietoja: {
                  fi: 'Lisätietoa',
                },
              },
            ],
          },
        ],
        pohjakoulutusvaatimusKoodiUrit: ['pohjakoulutusvaatimustoinenaste_0#1'],
        valintaperuste: '649adb37-cd4d-4846-91a9-84b58b90f928',
        ensikertalaisenAloituspaikat: null,
        eriHakulomake: true,
        hakulomaketyyppi: 'ataru',
        hakulomakeId: 'lomake_1',
        hakulomakeLinkki: {},
        hakulomakeKuvaus: {},
        organisaatioOid: '1.1.1.1.1.1',
        toteutusOid: '2.1.1.1.1.1',
        hakuOid: '4.1.1.1.1.1',
        tila: 'julkaistu',
        muokkaaja: '1.2.246.562.24.62301161440',
      },
    },
    'should be able to edit hakukohde': {
      '1': {
        oid: '6.1.1.1.1.1',
        toteutusOid: '2.1.1.1.1.1',
        hakuOid: '4.1.1.1.1.1',
        tila: 'tallennettu',
        nimi: {
          fi: 'Hakukohteen nimi',
        },
        alkamiskausiKoodiUri: 'kausi_0#1',
        alkamisvuosi: 2024,
        hakulomake: {},
        aloituspaikat: 100,
        pohjakoulutusvaatimusKoodiUrit: ['pohjakoulutusvaatimustoinenaste_0#1'],
        muuPohjakoulutusvaatimus: {},
        toinenAsteOnkoKaksoistutkinto: true,
        kaytetaanHaunAikataulua: false,
        liitteetOnkoSamaToimitusaika: false,
        liitteetOnkoSamaToimitusosoite: false,
        liitteidenToimitusosoite: {
          osoite: {
            osoite: {
              fi: 'Paasikivenkatu 7',
            },
            postinumero: '15110',
            postitoimipaikka: {
              fi: 'Lahti',
            },
          },
          sahkoposti: 'salpaus@salpaus.fi',
        },
        liitteet: [
          {
            tyyppi: null,
            nimi: {
              fi: 'Nimi',
            },
            toimitusaika: '2011-11-11T10:30',
            toimitusosoite: {
              osoite: {
                osoite: {
                  fi: 'Osoite',
                },
                postinumero: '00940',
                postitoimipaikka: {
                  fi: 'Postitoimipaikka',
                },
              },
              sahkoposti: 'sahkoposti@email.com',
            },
            kuvaus: {
              fi: 'Kuvaus',
            },
          },
        ],
        valintakokeet: [
          {
            tyyppi: 'valintakokeentyyppi_0#1',
            tilaisuudet: [
              {
                osoite: {
                  osoite: {
                    fi: 'Osoite',
                  },
                  postinumero: '00940',
                  postitoimipaikka: {
                    fi: 'Postitoimipaikka',
                  },
                },
                aika: {
                  alkaa: '2011-11-11T10:30',
                  paattyy: '2011-11-12T11:45',
                },
                lisatietoja: {
                  fi: 'Lisätietoja',
                },
              },
            ],
          },
        ],
        hakuajat: [
          {
            alkaa: '2011-11-11T10:30',
            paattyy: '2011-11-12T11:45',
          },
        ],
        muokkaaja: '1.2.246.562.24.62301161440',
        organisaatioOid: '1.1.1.1.1.1',
        kielivalinta: ['fi'],
        modified: '2019-04-04T08:28',
        liitteidenToimitusaika: null,
        valintaperuste: null,
        ensikertalaisenAloituspaikat: null,
        eriHakulomake: true,
        hakulomaketyyppi: 'ataru',
        hakulomakeId: '12345',
        hakulomakeLinkki: {},
        hakulomakeKuvaus: {},
      },
    },
  },
  __version: '3.2.0',
};
