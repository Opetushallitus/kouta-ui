module.exports = {
  createHakuForm: {
    'should be able to create haku': {
      '1': {
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
        alkamisvuosi: 2020,
        hakulomakeAtaruId: 'lomake_1',
        hakulomakeLinkki: {},
        hakulomakeKuvaus: {},
        organisaatioOid: '1.1.1.1.1.1',
      },
    },
  },
  editHakuForm: {
    'should be able to edit haku': {
      '1': {
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
        kohdejoukonTarkenneKoodiUri: null,
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
      },
    },
  },
  createHakukohdeForm: {
    'should be able to create ammatillinen hakukohde': {
      '1': {
        muokkaaja: '1.2.246.562.24.62301161440',
        tila: 'julkaistu',
        alkamiskausiKoodiUri: 'kausi_0#1',
        kaytetaanHaunAikataulua: false,
        kielivalinta: ['fi'],
        minAloituspaikat: 5,
        maxAloituspaikat: 10,
        hakuajat: [
          {
            alkaa: '2019-04-02T10:45',
            paattyy: '2019-11-25T23:59',
          },
        ],
        liitteetOnkoSamaToimitusaika: false,
        liitteetOnkoSamaToimitusosoite: false,
        liitteidenToimitustapa: null,
        liitteet: [
          {
            toimitustapa: 'osoite',
            tyyppiKoodiUri: 'liitetyypitamm_0#1',
            nimi: {
              fi: 'Nimi',
            },
            toimitusaika: '2019-11-25T23:59',
            toimitusosoite: {
              osoite: {
                osoite: {
                  fi: 'Osoite',
                },
                postinumeroKoodiUri: 'posti_0#2',
              },
              sahkoposti: 'sahkoposti@email.com',
            },
            kuvaus: {
              fi: 'Kuvaus',
            },
          },
        ],
        alkamisvuosi: 2020,
        liitteidenToimitusosoite: null,
        liitteidenToimitusaika: null,
        nimi: {
          fi: 'Hakukohteen nimi',
        },
        toinenAsteOnkoKaksoistutkinto: true,
        valintakokeet: [
          {
            tyyppiKoodiUri: 'valintakokeentyyppi_1#1',
            tilaisuudet: [
              {
                osoite: {
                  osoite: {
                    fi: 'osoite',
                  },
                  postinumeroKoodiUri: 'posti_0#2',
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
        pohjakoulutusvaatimusKoodiUrit: ['pohjakoulutusvaatimustoinenaste_0#1'],
        pohjakoulutusvaatimusTarkenne: {
          fi: '<p>Tarkenne</p>',
        },
        valintaperusteId: '649adb37-cd4d-4846-91a9-84b58b90f928',
        minEnsikertalaisenAloituspaikat: null,
        maxEnsikertalaisenAloituspaikat: null,
        kaytetaanHaunHakulomaketta: false,
        hakulomaketyyppi: 'ataru',
        hakulomakeAtaruId: 'lomake_1',
        hakulomakeLinkki: {},
        hakulomakeKuvaus: {},
        kaytetaanHaunAlkamiskautta: false,
        organisaatioOid: '1.1.1.1.1.1',
        hakuOid: '4.1.1.1.1.1',
        toteutusOid: '2.1.1.1.1.1',
      },
    },
    'should be able to create korkeakoulu hakukohde': {
      '1': {
        muokkaaja: '1.2.246.562.24.62301161440',
        tila: 'julkaistu',
        alkamiskausiKoodiUri: 'kausi_0#1',
        kaytetaanHaunAikataulua: false,
        kielivalinta: ['fi'],
        minAloituspaikat: 5,
        maxAloituspaikat: 10,
        hakuajat: [
          {
            alkaa: '2019-04-02T10:45',
            paattyy: '2019-11-25T23:59',
          },
        ],
        liitteetOnkoSamaToimitusaika: false,
        liitteetOnkoSamaToimitusosoite: false,
        liitteidenToimitustapa: null,
        liitteet: [
          {
            toimitustapa: 'osoite',
            tyyppiKoodiUri: 'liitetyypitamm_0#1',
            nimi: {
              fi: 'Nimi',
            },
            toimitusaika: '2019-11-25T23:59',
            toimitusosoite: {
              osoite: {
                osoite: {
                  fi: 'Osoite',
                },
                postinumeroKoodiUri: 'posti_0#2',
              },
              sahkoposti: 'sahkoposti@email.com',
            },
            kuvaus: {
              fi: 'Kuvaus',
            },
          },
        ],
        alkamisvuosi: 2020,
        liitteidenToimitusosoite: null,
        liitteidenToimitusaika: null,
        nimi: {
          fi: 'Hakukohteen nimi',
        },
        toinenAsteOnkoKaksoistutkinto: false,
        valintakokeet: [
          {
            tyyppiKoodiUri: 'valintakokeentyyppi_1#1',
            tilaisuudet: [
              {
                osoite: {
                  osoite: {
                    fi: 'osoite',
                  },
                  postinumeroKoodiUri: 'posti_0#2',
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
        pohjakoulutusvaatimusKoodiUrit: ['pohjakoulutusvaatimustoinenaste_0#1'],
        pohjakoulutusvaatimusTarkenne: {
          fi: '<p>Tarkenne</p>',
        },
        valintaperusteId: '649adb37-cd4d-4846-91a9-84b58b90f928',
        minEnsikertalaisenAloituspaikat: 1,
        maxEnsikertalaisenAloituspaikat: 5,
        kaytetaanHaunHakulomaketta: false,
        hakulomaketyyppi: 'ataru',
        hakulomakeAtaruId: 'lomake_1',
        hakulomakeLinkki: {},
        hakulomakeKuvaus: {},
        kaytetaanHaunAlkamiskautta: false,
        organisaatioOid: '1.1.1.1.1.1',
        hakuOid: '4.1.1.1.1.1',
        toteutusOid: '2.1.1.1.1.1',
      },
    },
  },
  editHakukohdeForm: {
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
        minAloituspaikat: 100,
        maxAloituspaikat: 150,
        minEnsikertalaisenAloituspaikat: 39,
        maxEnsikertalaisenAloituspaikat: 49,
        kaytetaanHaunAlkamiskautta: false,
        pohjakoulutusvaatimusKoodiUrit: ['pohjakoulutusvaatimustoinenaste_0#1'],
        pohjakoulutusvaatimusTarkenne: {
          fi: '<p>Fi tarkenne</p>',
        },
        muuPohjakoulutusvaatimus: {},
        toinenAsteOnkoKaksoistutkinto: true,
        kaytetaanHaunAikataulua: false,
        liitteetOnkoSamaToimitusaika: false,
        liitteetOnkoSamaToimitusosoite: false,
        liitteidenToimitusosoite: null,
        liitteidenToimitustapa: null,
        liitteet: [
          {
            toimitustapa: 'osoite',
            tyyppiKoodiUri: 'liitetyypitamm_0#1',
            nimi: {
              fi: 'Nimi',
            },
            toimitusaika: '2011-11-11T10:30',
            toimitusosoite: {
              osoite: {
                osoite: {
                  fi: 'Osoite',
                },
                postinumeroKoodiUri: 'posti_0#2',
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
            tyyppiKoodiUri: 'valintakokeentyyppi_0#1',
            tilaisuudet: [
              {
                osoite: {
                  osoite: {
                    fi: 'Osoite',
                  },
                  postinumeroKoodiUri: 'posti_0#2',
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
        kaytetaanHaunHakulomaketta: false,
        hakulomaketyyppi: 'ataru',
        hakulomakeAtaruId: '12345',
        hakulomakeKuvaus: {},
        hakulomakeLinkki: {},
        valintaperusteId: 'b9d53560-a7f0-45d3-bd9d-46e67e6049ba',
        liitteidenToimitusaika: null,
      },
    },
  },
  createKoulutusForm: {
    'should be able to create korkeakoulu koulutus': {
      '1': {
        johtaaTutkintoon: true,
        muokkaaja: '1.2.246.562.24.62301161440',
        tila: 'julkaistu',
        kielivalinta: ['fi'],
        tarjoajat: ['4.1.1.1.1.1', '5.1.1.1.1.1'],
        koulutusKoodiUri: 'koulutus_2#1',
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
        organisaatioOid: '1.1.1.1.1.1',
      },
    },
  },
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
        julkinen: true,
        muokkaaja: '1.2.246.562.24.62301161440',
        organisaatioOid: '1.1.1.1.1.1',
        kielivalinta: ['fi'],
        modified: '2019-04-01T13:01',
        johtaaTutkintoon: true,
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
    'should be able to edit lukiokoulutus': {
      '1': {
        oid: '1.2.3.4.5.6',
        koulutustyyppi: 'lk',
        koulutusKoodiUri: 'koulutus_0#1',
        tila: 'tallennettu',
        tarjoajat: ['4.1.1.1.1.1', '2.1.1.1.1.1'],
        nimi: {
          fi: 'Maatalousalan perustutkinto',
        },
        metadata: {
          tyyppi: 'lk',
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
        julkinen: true,
        muokkaaja: '1.2.246.562.24.62301161440',
        organisaatioOid: '1.1.1.1.1.1',
        kielivalinta: ['fi'],
        modified: '2019-04-01T13:01',
        johtaaTutkintoon: true,
      },
    },
  },
  createOppilaitosForm: {
    'should be able to create oppilaitos': {
      '1': {
        organisaatioOid: '1.1.1.1.1.1',
        oid: '1.1.1.1.1.1',
        tila: 'julkaistu',
        muokkaaja: '1.2.246.562.24.62301161440',
        kielivalinta: ['fi'],
        metadata: {
          yhteystiedot: {
            osoite: {
              osoite: {
                fi: 'Osoite',
              },
              postinumeroKoodiUri: 'posti_0#2',
            },
            sahkoposti: {
              fi: 'sahkoposti@sahkoposti.fi',
            },
            puhelinnumero: {
              fi: '12345',
            },
            wwwSivu: {
              fi: 'www.verkkosivu.fi',
            },
          },
          esittely: {
            fi: '<p>Esittely</p>',
          },
          tietoaOpiskelusta: [
            {
              otsikkoKoodiUri: 'koulutuksenlisatiedot_0#1',
              teksti: {
                fi: 'Tietoa',
              },
            },
          ],
          opiskelijoita: 1,
          korkeakouluja: 2,
          tiedekuntia: 3,
          kampuksia: 4,
          yksikoita: 5,
          toimipisteita: 6,
          akatemioita: 7,
        },
      },
    },
  },
  editOppilaitosForm: {
    'should be able to edit oppilaitos': {
      '1': {
        organisaatioOid: '1.1.1.1.1.1',
        oid: '1.1.1.1.1.1',
        kielivalinta: ['fi'],
        tila: 'tallennettu',
        metadata: {
          yhteystiedot: {
            osoite: {
              osoite: {
                fi: 'Fi osoite',
              },
              postinumeroKoodiUri: 'posti_0#2',
            },
            sahkoposti: {
              fi: 'fi@sahkoposti.fi',
            },
            puhelinnumero: {
              fi: '1234',
            },
            wwwSivu: {
              fi: 'www.verkkosivu.fi',
            },
          },
          esittely: {
            fi: '<p><em>Fi esittely</em></p>',
          },
          tietoaOpiskelusta: [
            {
              otsikkoKoodiUri: 'koulutuksenlisatiedot_0#1',
              teksti: {
                fi: 'Fi tiedot',
              },
            },
          ],
          opiskelijoita: 100,
          korkeakouluja: 5,
          tiedekuntia: 4,
          kampuksia: 3,
          yksikoita: 2,
          toimipisteita: 9,
          akatemioita: 1,
        },
        muokkaaja: '1.2.246.562.24.62301161440',
      },
    },
  },
  createSoraKuvausForm: {
    'should be able to create sora-kuvaus': {
      '1': {
        tila: 'julkaistu',
        muokkaaja: '1.2.246.562.24.62301161440',
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
        organisaatioOid: '1.1.1.1.1.1',
      },
    },
  },
  editSoraKuvausForm: {
    'should be able to edit sora-kuvaus': {
      '1': {
        id: '123e4567-e89b-12d3-a456-426655440000',
        tila: 'tallennettu',
        julkinen: true,
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
  createToteutusForm: {
    'should be able to create ammatillinen toteutus': {
      '1': {
        nimi: {
          fi: 'toteutuksen nimi',
        },
        tarjoajat: ['4.1.1.1.1.1', '5.1.1.1.1.1'],
        kielivalinta: ['fi'],
        tila: 'julkaistu',
        muokkaaja: '1.2.246.562.24.62301161440',
        metadata: {
          opetus: {
            lisatiedot: [
              {
                otsikkoKoodiUri: 'koulutuksenlisatiedot_0#1',
                teksti: {
                  fi: 'koulutuksenlisatiedot_0 kuvaus',
                },
              },
            ],
            opetuskieliKoodiUrit: ['oppilaitoksenopetuskieli_0#1'],
            onkoMaksullinen: true,
            maksunMaara: 10,
            opetustapaKoodiUrit: ['opetuspaikkakk_0#1'],
            opetusaikaKoodiUrit: ['opetusaikakk_0#1'],
            opetuskieletKuvaus: {
              fi: 'opetuskieli kuvaus',
            },
            opetustapaKuvaus: {
              fi: 'opetustapa kuvaus',
            },
            opetusaikaKuvaus: {
              fi: 'opetusaika kuvaus',
            },
            maksullisuusKuvaus: {
              fi: 'maksullisuus kuvaus',
            },
            koulutuksenAlkamispaivamaara: '2019-01-01T00:00',
            koulutuksenPaattymispaivamaara: '2019-02-15T00:00',
            onkoStipendia: false,
            stipendinKuvaus: {},
            stipendinMaara: null,
            diplomiKoodiUrit: [],
            diplomiKuvaus: {},
            A1JaA2Kielivalikoima: [],
            aidinkieliKielivalikoima: [],
            B1Kielivalikoima: [],
            B2Kielivalikoima: [],
            B3Kielivalikoima: [],
            muuKielivalikoima: [],
          },
          lukiolinjaKoodiUri: null,
          osaamisalat: [
            {
              koodiUri: 'osaamisala_0',
              linkki: {
                fi: 'osaamisala_0 linkki',
              },
              otsikko: {
                fi: 'osaamisala_0 otsikko',
              },
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
              sahkoposti: {
                fi: 'sähkoposti',
              },
              puhelinnumero: {
                fi: 'puhelin',
              },
              wwwSivu: {
                fi: 'verkkosivu',
              },
            },
          ],
          ammattinimikkeet: [],
          asiasanat: [
            {
              kieli: 'fi',
              arvo: 'avainsana',
            },
          ],
          ylemmanKorkeakoulututkinnonOsaamisalat: [],
          alemmanKorkeakoulututkinnonOsaamisalat: [],
          kuvaus: {
            fi: 'Toteutuksen kuvaus',
          },
          tyyppi: 'amm',
          laajuus: null,
          laajuusyksikkoKoodiUri: null,
          ilmoittautumislinkki: {},
          aloituspaikat: null,
          suunniteltuKesto: {},
          toteutusjaksot: [],
          tutkinnonOsat: [],
        },
        organisaatioOid: '1.1.1.1.1.1',
        koulutusOid: '1.2.1.1.1.1',
      },
    },
    'should be able to create korkeakoulu toteutus': {
      '1': {
        nimi: {
          fi: 'toteutuksen nimi',
        },
        tarjoajat: ['4.1.1.1.1.1', '5.1.1.1.1.1'],
        kielivalinta: ['fi'],
        tila: 'julkaistu',
        muokkaaja: '1.2.246.562.24.62301161440',
        metadata: {
          opetus: {
            lisatiedot: [
              {
                otsikkoKoodiUri: 'koulutuksenlisatiedot_0#1',
                teksti: {
                  fi: 'koulutuksenlisatiedot_0 kuvaus',
                },
              },
            ],
            opetuskieliKoodiUrit: ['oppilaitoksenopetuskieli_0#1'],
            onkoMaksullinen: false,
            maksunMaara: null,
            opetustapaKoodiUrit: ['opetuspaikkakk_0#1'],
            opetusaikaKoodiUrit: ['opetusaikakk_0#1'],
            opetuskieletKuvaus: {
              fi: 'opetuskieli kuvaus',
            },
            opetustapaKuvaus: {
              fi: 'opetustapa kuvaus',
            },
            opetusaikaKuvaus: {
              fi: 'opetusaika kuvaus',
            },
            maksullisuusKuvaus: {
              fi: 'maksullisuus kuvaus',
            },
            koulutuksenAlkamispaivamaara: '2019-01-01T00:00',
            koulutuksenPaattymispaivamaara: '2019-02-15T00:00',
            onkoStipendia: true,
            stipendinKuvaus: {
              fi: 'stipendi kuvaus',
            },
            stipendinMaara: 20,
            diplomiKoodiUrit: [],
            diplomiKuvaus: {},
            A1JaA2Kielivalikoima: [],
            aidinkieliKielivalikoima: [],
            B1Kielivalikoima: [],
            B2Kielivalikoima: [],
            B3Kielivalikoima: [],
            muuKielivalikoima: [],
          },
          lukiolinjaKoodiUri: null,
          osaamisalat: [],
          yhteyshenkilot: [
            {
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
              wwwSivu: {
                fi: 'verkkosivu',
              },
            },
          ],
          ammattinimikkeet: [
            {
              kieli: 'fi',
              arvo: 'ammattinimike',
            },
          ],
          asiasanat: [
            {
              kieli: 'fi',
              arvo: 'avainsana',
            },
          ],
          ylemmanKorkeakoulututkinnonOsaamisalat: [
            {
              kuvaus: {
                fi: 'osaamisalan kuvaus',
              },
              nimi: {
                fi: 'osaamisalan nimi',
              },
              linkki: {
                fi: 'linkki',
              },
              otsikko: {
                fi: 'osaamisalan otsikko',
              },
            },
          ],
          alemmanKorkeakoulututkinnonOsaamisalat: [
            {
              kuvaus: {
                fi: 'osaamisalan kuvaus',
              },
              nimi: {
                fi: 'osaamisalan nimi',
              },
              linkki: {
                fi: 'linkki',
              },
              otsikko: {
                fi: 'osaamisalan otsikko',
              },
            },
          ],
          kuvaus: {
            fi: 'Toteutuksen kuvaus',
          },
          tyyppi: 'yo',
          laajuus: null,
          laajuusyksikkoKoodiUri: null,
          ilmoittautumislinkki: {},
          aloituspaikat: null,
          suunniteltuKesto: {},
          toteutusjaksot: [],
          tutkinnonOsat: [],
        },
        organisaatioOid: '1.1.1.1.1.1',
        koulutusOid: '1.2.1.1.1.1',
      },
    },
    'should be able to create lukio toteutus': {
      '1': {
        nimi: {
          fi: 'lukiolinjat_0',
        },
        tarjoajat: ['4.1.1.1.1.1', '5.1.1.1.1.1'],
        kielivalinta: ['fi'],
        tila: 'julkaistu',
        muokkaaja: '1.2.246.562.24.62301161440',
        metadata: {
          opetus: {
            lisatiedot: [
              {
                otsikkoKoodiUri: 'koulutuksenlisatiedot_0#1',
                teksti: {
                  fi: 'koulutuksenlisatiedot_0 kuvaus',
                },
              },
            ],
            opetuskieliKoodiUrit: ['oppilaitoksenopetuskieli_0#1'],
            onkoMaksullinen: true,
            maksunMaara: 10,
            opetustapaKoodiUrit: ['opetuspaikkakk_0#1'],
            opetusaikaKoodiUrit: ['opetusaikakk_0#1'],
            opetuskieletKuvaus: {
              fi: 'opetuskieli kuvaus',
            },
            opetustapaKuvaus: {
              fi: 'opetustapa kuvaus',
            },
            opetusaikaKuvaus: {
              fi: 'opetusaika kuvaus',
            },
            maksullisuusKuvaus: {
              fi: 'maksullisuus kuvaus',
            },
            koulutuksenAlkamispaivamaara: '2019-01-01T00:00',
            koulutuksenPaattymispaivamaara: '2019-02-15T00:00',
            onkoStipendia: true,
            stipendinKuvaus: {
              fi: 'stipendi kuvaus',
            },
            stipendinMaara: 20,
            diplomiKoodiUrit: ['lukiodiplomit_0#1'],
            diplomiKuvaus: {
              fi: 'Diplomi kuvaus',
            },
            A1JaA2Kielivalikoima: ['kieli_0#1'],
            aidinkieliKielivalikoima: ['kieli_2#1'],
            B1Kielivalikoima: ['kieli_3#1'],
            B2Kielivalikoima: ['kieli_1#1'],
            B3Kielivalikoima: ['kieli_4#1'],
            muuKielivalikoima: ['kieli_4#1'],
          },
          lukiolinjaKoodiUri: 'lukiolinjat_0#1',
          osaamisalat: [],
          yhteyshenkilot: [
            {
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
              wwwSivu: {
                fi: 'verkkosivu',
              },
            },
          ],
          ammattinimikkeet: [
            {
              kieli: 'fi',
              arvo: 'ammattinimike',
            },
          ],
          asiasanat: [
            {
              kieli: 'fi',
              arvo: 'avainsana',
            },
          ],
          ylemmanKorkeakoulututkinnonOsaamisalat: [],
          alemmanKorkeakoulututkinnonOsaamisalat: [],
          kuvaus: {},
          tyyppi: 'lk',
          laajuus: null,
          laajuusyksikkoKoodiUri: null,
          ilmoittautumislinkki: {},
          aloituspaikat: null,
          suunniteltuKesto: {},
          toteutusjaksot: [],
          tutkinnonOsat: [],
        },
        organisaatioOid: '1.1.1.1.1.1',
        koulutusOid: '1.2.1.1.1.1',
      },
    },
  },
  editToteutusForm: {
    'should be able to edit ammatillinen toteutus': {
      '1': {
        oid: '1.3.1.1.1.1',
        koulutusOid: '1.2.1.1.1.1',
        tila: 'tallennettu',
        tarjoajat: ['5.1.1.1.1.1', '3.1.1.1.1.1'],
        nimi: {
          fi: 'Koulutuskeskus Salpaus, jatkuva haku, eläintenhoitaja',
        },
        metadata: {
          opetus: {
            lisatiedot: [
              {
                otsikkoKoodiUri: 'koulutuksenlisatiedot_0#1',
                teksti: {
                  fi: 'koulutuksenlisatiedot_0 kuvaus',
                },
              },
            ],
            opetuskieliKoodiUrit: ['oppilaitoksenopetuskieli_1#1'],
            onkoMaksullinen: true,
            maksunMaara: 20,
            opetustapaKoodiUrit: ['opetuspaikkakk_1#1'],
            opetusaikaKoodiUrit: ['opetusaikakk_1#1'],
            opetuskieletKuvaus: {
              fi: 'Opetuskieli kuvaus',
            },
            opetustapaKuvaus: {
              fi: 'Opetustapa kuvaus',
            },
            opetusaikaKuvaus: {
              fi: 'Opetusaika kuvaus',
            },
            maksullisuusKuvaus: {
              fi: 'Maksullisuus kuvaus',
            },
            koulutuksenAlkamispaivamaara: '2019-08-23T00:00',
            koulutuksenPaattymispaivamaara: '2019-08-26T00:00',
            onkoStipendia: true,
            stipendinKuvaus: {
              fi: 'Stipendin kuvaus',
            },
            stipendinMaara: 90,
            diplomiKoodiUrit: [],
            diplomiKuvaus: {},
            A1JaA2Kielivalikoima: [],
            aidinkieliKielivalikoima: [],
            B1Kielivalikoima: [],
            B2Kielivalikoima: [],
            B3Kielivalikoima: [],
            muuKielivalikoima: [],
          },
          lukiolinjaKoodiUri: null,
          osaamisalat: [
            {
              koodiUri: 'osaamisala_0',
              linkki: {
                fi: 'https://www.salpaus.fi/koulutusesittely/elaintenhoitaja/',
              },
              otsikko: {
                fi: 'Otsikko',
              },
            },
          ],
          yhteyshenkilot: [
            {
              nimi: {
                fi: 'Fi nimi',
              },
              titteli: {
                fi: 'Fi titteli',
              },
              sahkoposti: {
                fi: 'Fi sähköposti',
              },
              puhelinnumero: {
                fi: 'Fi puhelinnumero',
              },
              wwwSivu: {
                fi: 'Fi verkkosivu',
              },
            },
          ],
          ammattinimikkeet: [
            {
              kieli: 'fi',
              arvo: 'eläintenhoitaja',
            },
          ],
          asiasanat: [
            {
              kieli: 'fi',
              arvo: 'koira',
            },
            {
              kieli: 'fi',
              arvo: 'eläintenhoito',
            },
          ],
          ylemmanKorkeakoulututkinnonOsaamisalat: [],
          alemmanKorkeakoulututkinnonOsaamisalat: [],
          kuvaus: {},
          tyyppi: 'amm',
          laajuus: null,
          laajuusyksikkoKoodiUri: null,
          ilmoittautumislinkki: {},
          aloituspaikat: null,
          suunniteltuKesto: {},
          toteutusjaksot: [],
          tutkinnonOsat: [],
        },
        muokkaaja: '1.2.246.562.24.62301161440',
        organisaatioOid: '1.1.1.1.1.1',
        kielivalinta: ['fi'],
        modified: '2019-03-26T10:19',
      },
    },
    'should be able to edit korkeakoulu toteutus': {
      '1': {
        oid: '1.3.1.1.1.1',
        koulutusOid: '1.2.1.1.1.1',
        tila: 'tallennettu',
        tarjoajat: ['5.1.1.1.1.1', '3.1.1.1.1.1'],
        nimi: {
          fi: 'Koulutuskeskus Salpaus, jatkuva haku, eläintenhoitaja',
        },
        metadata: {
          opetus: {
            lisatiedot: [
              {
                otsikkoKoodiUri: 'koulutuksenlisatiedot_0#1',
                teksti: {
                  fi: 'koulutuksenlisatiedot_0 kuvaus',
                },
              },
            ],
            opetuskieliKoodiUrit: ['oppilaitoksenopetuskieli_1#1'],
            onkoMaksullinen: true,
            maksunMaara: 20,
            opetustapaKoodiUrit: ['opetuspaikkakk_1#1'],
            opetusaikaKoodiUrit: ['opetusaikakk_1#1'],
            opetuskieletKuvaus: {
              fi: 'Opetuskieli kuvaus',
            },
            opetustapaKuvaus: {
              fi: 'Opetustapa kuvaus',
            },
            opetusaikaKuvaus: {
              fi: 'Opetusaika kuvaus',
            },
            maksullisuusKuvaus: {
              fi: 'Maksullisuus kuvaus',
            },
            koulutuksenAlkamispaivamaara: '2019-08-23T00:00',
            koulutuksenPaattymispaivamaara: '2019-08-26T00:00',
            onkoStipendia: true,
            stipendinKuvaus: {
              fi: 'Stipendin kuvaus',
            },
            stipendinMaara: 90,
            diplomiKoodiUrit: [],
            diplomiKuvaus: {},
            A1JaA2Kielivalikoima: [],
            aidinkieliKielivalikoima: [],
            B1Kielivalikoima: [],
            B2Kielivalikoima: [],
            B3Kielivalikoima: [],
            muuKielivalikoima: [],
          },
          lukiolinjaKoodiUri: null,
          osaamisalat: [],
          yhteyshenkilot: [
            {
              nimi: {
                fi: 'Fi nimi',
              },
              titteli: {
                fi: 'Fi titteli',
              },
              sahkoposti: {
                fi: 'Fi sähköposti',
              },
              puhelinnumero: {
                fi: 'Fi puhelinnumero',
              },
              wwwSivu: {
                fi: 'Fi verkkosivu',
              },
            },
          ],
          ammattinimikkeet: [
            {
              kieli: 'fi',
              arvo: 'eläintenhoitaja',
            },
          ],
          asiasanat: [
            {
              kieli: 'fi',
              arvo: 'koira',
            },
            {
              kieli: 'fi',
              arvo: 'eläintenhoito',
            },
          ],
          ylemmanKorkeakoulututkinnonOsaamisalat: [
            {
              kuvaus: {
                fi: 'osaamisalan kuvaus',
              },
              nimi: {
                fi: 'osaamisalan nimi',
              },
              linkki: {
                fi: 'linkki',
              },
              otsikko: {
                fi: 'osaamisalan otsikko',
              },
            },
          ],
          alemmanKorkeakoulututkinnonOsaamisalat: [
            {
              kuvaus: {
                fi: 'osaamisalan kuvaus',
              },
              nimi: {
                fi: 'osaamisalan nimi',
              },
              linkki: {
                fi: 'linkki',
              },
              otsikko: {
                fi: 'osaamisalan otsikko',
              },
            },
          ],
          kuvaus: {},
          tyyppi: 'yo',
          laajuus: null,
          laajuusyksikkoKoodiUri: null,
          ilmoittautumislinkki: {},
          aloituspaikat: null,
          suunniteltuKesto: {},
          toteutusjaksot: [],
          tutkinnonOsat: [],
        },
        muokkaaja: '1.2.246.562.24.62301161440',
        organisaatioOid: '1.1.1.1.1.1',
        kielivalinta: ['fi'],
        modified: '2019-03-26T10:19',
      },
    },
    'should be able to edit lukio toteutus': {
      '1': {
        oid: '1.3.1.1.1.1',
        koulutusOid: '1.2.1.1.1.1',
        tila: 'tallennettu',
        tarjoajat: ['5.1.1.1.1.1', '3.1.1.1.1.1'],
        nimi: {
          fi: 'Koulutuskeskus Salpaus, jatkuva haku, eläintenhoitaja',
        },
        metadata: {
          opetus: {
            lisatiedot: [
              {
                otsikkoKoodiUri: 'koulutuksenlisatiedot_0#1',
                teksti: {
                  fi: 'koulutuksenlisatiedot_0 kuvaus',
                },
              },
            ],
            opetuskieliKoodiUrit: ['oppilaitoksenopetuskieli_1#1'],
            onkoMaksullinen: true,
            maksunMaara: 20,
            opetustapaKoodiUrit: ['opetuspaikkakk_1#1'],
            opetusaikaKoodiUrit: ['opetusaikakk_1#1'],
            opetuskieletKuvaus: {
              fi: 'Opetuskieli kuvaus',
            },
            opetustapaKuvaus: {
              fi: 'Opetustapa kuvaus',
            },
            opetusaikaKuvaus: {
              fi: 'Opetusaika kuvaus',
            },
            maksullisuusKuvaus: {
              fi: 'Maksullisuus kuvaus',
            },
            koulutuksenAlkamispaivamaara: '2019-08-23T00:00',
            koulutuksenPaattymispaivamaara: '2019-08-26T00:00',
            onkoStipendia: true,
            stipendinKuvaus: {
              fi: 'Stipendin kuvaus',
            },
            stipendinMaara: 90,
            diplomiKoodiUrit: ['lukiodiplomit_1#1'],
            diplomiKuvaus: {
              fi: 'Fi diplomi',
            },
            A1JaA2Kielivalikoima: ['kieli_1#1'],
            aidinkieliKielivalikoima: ['kieli_4#1'],
            B1Kielivalikoima: ['kieli_3#1'],
            B2Kielivalikoima: ['kieli_2#1'],
            B3Kielivalikoima: ['kieli_4#1'],
            muuKielivalikoima: ['kieli_4#1'],
          },
          lukiolinjaKoodiUri: 'lukiolinjat_0#1',
          osaamisalat: [],
          yhteyshenkilot: [
            {
              nimi: {
                fi: 'Fi nimi',
              },
              titteli: {
                fi: 'Fi titteli',
              },
              sahkoposti: {
                fi: 'Fi sähköposti',
              },
              puhelinnumero: {
                fi: 'Fi puhelinnumero',
              },
              wwwSivu: {
                fi: 'Fi verkkosivu',
              },
            },
          ],
          ammattinimikkeet: [
            {
              kieli: 'fi',
              arvo: 'eläintenhoitaja',
            },
          ],
          asiasanat: [
            {
              kieli: 'fi',
              arvo: 'koira',
            },
            {
              kieli: 'fi',
              arvo: 'eläintenhoito',
            },
          ],
          ylemmanKorkeakoulututkinnonOsaamisalat: [],
          alemmanKorkeakoulututkinnonOsaamisalat: [],
          kuvaus: {},
          tyyppi: 'lk',
          laajuus: null,
          laajuusyksikkoKoodiUri: null,
          ilmoittautumislinkki: {},
          aloituspaikat: null,
          suunniteltuKesto: {},
          toteutusjaksot: [],
          tutkinnonOsat: [],
        },
        muokkaaja: '1.2.246.562.24.62301161440',
        organisaatioOid: '1.1.1.1.1.1',
        kielivalinta: ['fi'],
        modified: '2019-03-26T10:19',
      },
    },
  },
  createValintaperusteForm: {
    'should be able to create valintaperuste': {
      '1': {
        tila: 'julkaistu',
        muokkaaja: '1.2.246.562.24.62301161440',
        kielivalinta: ['fi'],
        hakutapaKoodiUri: 'hakutapa_0#1',
        kohdejoukkoKoodiUri: 'haunkohdejoukko_0#1',
        nimi: {
          fi: 'Valintaperusteen nimi',
        },
        koulutustyyppi: 'yo',
        onkoJulkinen: true,
        valintakokeet: [
          {
            tyyppiKoodiUri: 'valintakokeentyyppi_1#1',
            tilaisuudet: [
              {
                osoite: {
                  osoite: {
                    fi: 'osoite',
                  },
                  postinumeroKoodiUri: 'posti_0#2',
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
        sorakuvausId: '1',
        metadata: {
          tyyppi: 'yo',
          valintatavat: [
            {
              kuvaus: {},
              nimi: {
                fi: 'Valintatavan nimi',
              },
              valintatapaKoodiUri: 'valintatapajono_0#1',
              sisalto: [
                {
                  tyyppi: 'teksti',
                  data: {
                    fi: '<p>Sisältötekstiä</p>',
                  },
                },
                {
                  tyyppi: 'taulukko',
                  data: {
                    rows: [
                      {
                        columns: [
                          {
                            text: {
                              fi: 'Solu',
                            },
                            index: 0,
                          },
                        ],
                        index: 0,
                      },
                    ],
                  },
                },
              ],
              kaytaMuuntotaulukkoa: false,
              kynnysehto: {
                fi: 'Kynnysehto',
              },
              enimmaispisteet: 100,
              vahimmaispisteet: 10,
            },
          ],
          kielitaitovaatimukset: [],
          osaamistaustaKoodiUrit: [],
          kuvaus: {
            fi: '<p>Kuvaus</p>',
          },
        },
        organisaatioOid: '1.1.1.1.1.1',
      },
    },
  },
  editValintaperusteForm: {
    'should be able to edit valintaperuste': {
      '1': {
        koulutustyyppi: 'amm',
        id: '649adb37-cd4d-4846-91a9-84b58b90f928',
        tila: 'tallennettu',
        hakutapaKoodiUri: 'hakutapa_0#1',
        kohdejoukkoKoodiUri: 'haunkohdejoukko_0#1',
        nimi: {
          fi: 'Valintaperusteen nimi',
        },
        julkinen: false,
        sorakuvausId: '1',
        metadata: {
          tyyppi: 'amm',
          valintatavat: [
            {
              kuvaus: {},
              nimi: {
                fi: 'Valintatavan nimi',
              },
              valintatapaKoodiUri: 'valintatapajono_0#1',
              sisalto: [
                {
                  tyyppi: 'teksti',
                  data: {
                    fi: '<p>Tekstia</p>',
                  },
                },
                {
                  tyyppi: 'taulukko',
                  data: {
                    nimi: {},
                    rows: [
                      {
                        index: 0,
                        isHeader: false,
                        columns: [
                          {
                            index: 0,
                            text: {
                              fi: 'Solu',
                            },
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
              kaytaMuuntotaulukkoa: false,
              kynnysehto: {
                fi: 'Kynnysehto',
              },
              enimmaispisteet: 100,
              vahimmaispisteet: 10,
            },
          ],
          kielitaitovaatimukset: [],
          osaamistaustaKoodiUrit: [],
          kuvaus: {
            fi: '<p>Loppukuvaus</p>',
          },
        },
        organisaatioOid: '1.1.1.1.1.1',
        muokkaaja: '1.2.246.562.24.62301161440',
        kielivalinta: ['fi'],
        modified: '2019-04-03T13:56',
        valintakokeet: [
          {
            tyyppiKoodiUri: 'tyyppi_1#1',
            tilaisuudet: [
              {
                osoite: {
                  osoite: {
                    fi: 'fi osoite',
                  },
                  postinumeroKoodiUri: 'posti_00350#1',
                },
                aika: {
                  alkaa: '2019-04-16T08:44',
                  paattyy: '2019-04-18T08:44',
                },
                lisatietoja: {
                  fi: 'fi lisatietoja',
                },
              },
            ],
          },
        ],
        onkoJulkinen: false,
      },
    },
  },
  __version: '3.8.2',
};
