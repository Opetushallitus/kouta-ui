module.exports = {
  createToteutusForm: {
    'should be able to create ammatillinen toteutus': {
      '1': {
        tila: 'julkaistu',
        muokkaaja: '1.2.246.562.24.62301161440',
        organisaatioOid: '1.1.1.1.1.1',
        koulutusOid: '1.2.1.1.1.1',
        nimi: {
          fi: 'toteutuksen nimi',
        },
        tarjoajat: ['5.1.1.1.1.1', '3.1.1.1.1.1'],
        kielivalinta: ['fi'],
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
            alkamisaikaKuvaus: {
              fi: 'kausi kuvaus',
            },
            alkamiskausiKoodiUri: 'kausi_0#1',
            alkamisvuosi: '2019',
            onkoLukuvuosimaksua: false,
            lukuvuosimaksu: null,
            onkoStipendia: false,
            stipendinKuvaus: {},
            stipendinMaara: {},
          },
          osaamisalat: [
            {
              koodi: 'osaamisala_0',
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
          tyyppi: 'amm',
        },
      },
    },
    'should be able to create korkeakoulu toteutus': {
      '1': {
        tila: 'julkaistu',
        muokkaaja: '1.2.246.562.24.62301161440',
        organisaatioOid: '1.1.1.1.1.1',
        koulutusOid: '1.2.1.1.1.1',
        nimi: {
          fi: 'toteutuksen nimi',
        },
        tarjoajat: ['5.1.1.1.1.1', '3.1.1.1.1.1'],
        kielivalinta: ['fi'],
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
            alkamisaikaKuvaus: {
              fi: 'kausi kuvaus',
            },
            alkamiskausiKoodiUri: 'kausi_0#1',
            alkamisvuosi: '2019',
            onkoLukuvuosimaksua: true,
            lukuvuosimaksu: 10,
            onkoStipendia: true,
            stipendinKuvaus: {
              fi: 'stipendi kuvaus',
            },
            stipendinMaara: {
              fi: '20',
            },
          },
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
            fi: 'toteutuksen kuvaus',
          },
          tyyppi: 'yo',
        },
      },
    },
  },
  __version: '3.3.0',
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
            maksunMaara: {
              fi: '20',
            },
            opetustapaKoodiUrit: ['opetuspaikkakk_1#1'],
            opetusaikaKoodiUri: 'opetusaikakk_1#1',
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
            alkamisaikaKuvaus: {
              fi: 'Alkamisaika kuvaus',
            },
            alkamiskausiKoodiUri: 'kausi_1#1',
            alkamisvuosi: '2024',
            onkoLukuvuosimaksua: false,
            lukuvuosimaksu: {},
            lukuvuosimaksuKuvaus: {},
            onkoStipendia: false,
            stipendinKuvaus: {},
            stipendinMaara: {},
          },
          osaamisalat: [
            {
              koodi: 'osaamisala_0',
              linkki: {
                fi: 'https://www.salpaus.fi/koulutusesittely/elaintenhoitaja/',
              },
              otsikko: {
                fi: 'Otsikko',
              },
            },
          ],
          yhteystieto: {
            nimi: {
              fi: 'Sami Raunio',
            },
            titteli: {
              fi: 'hakuhemmo',
            },
            sahkoposti: {
              fi: 'hakutoimisto@salpaus.fi',
            },
            puhelinnumero: {
              fi: '123456',
            },
            wwwSivu: {
              fi: 'www.salpaus.fi',
            },
          },
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
          kuvaus: {
            fi: 'Toteutuksen kuvaus',
          },
          tyyppi: 'amm',
        },
        muokkaaja: '1.2.246.562.24.62301161440',
        organisaatioOid: '1.1.1.1.1.1',
        kielivalinta: ['fi'],
        modified: '2019-03-26T10:19',
      },
      '2': {
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
            maksunMaara: null,
            opetustapaKoodiUrit: ['opetuspaikkakk_1#1'],
            opetusaikaKoodiUrit: [],
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
            alkamisaikaKuvaus: {
              fi: 'Alkamisaika kuvaus',
            },
            alkamiskausiKoodiUri: 'kausi_1#1',
            alkamisvuosi: '2024',
            onkoLukuvuosimaksua: false,
            lukuvuosimaksu: null,
            onkoStipendia: false,
            stipendinKuvaus: {},
            stipendinMaara: {},
          },
          osaamisalat: [
            {
              koodi: 'osaamisala_0',
              linkki: {
                fi: 'https://www.salpaus.fi/koulutusesittely/elaintenhoitaja/',
              },
              otsikko: {
                fi: 'Otsikko',
              },
            },
          ],
          yhteyshenkilot: [],
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
          kuvaus: {
            fi: 'Toteutuksen kuvaus',
          },
          tyyppi: 'amm',
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
            maksunMaara: {
              fi: '20',
            },
            opetustapaKoodiUrit: ['opetuspaikkakk_1#1'],
            opetusaikaKoodiUri: 'opetusaikakk_1#1',
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
            alkamisaikaKuvaus: {
              fi: 'Alkamisaika kuvaus',
            },
            alkamiskausiKoodiUri: 'kausi_1#1',
            alkamisvuosi: '2024',
            onkoLukuvuosimaksua: true,
            lukuvuosimaksu: {
              fi: '30',
            },
            lukuvuosimaksuKuvaus: {
              fi: 'Lukuvuosimaksu kuvaus',
            },
            onkoStipendia: true,
            stipendinKuvaus: {
              fi: 'Stipendin kuvaus',
            },
            stipendinMaara: {
              fi: '90',
            },
          },
          osaamisalat: [],
          yhteystieto: {
            nimi: {
              fi: 'Sami Raunio',
            },
            titteli: {
              fi: 'hakuhemmo',
            },
            sahkoposti: {
              fi: 'hakutoimisto@salpaus.fi',
            },
            puhelinnumero: {
              fi: '123456',
            },
            wwwSivu: {
              fi: 'www.salpaus.fi',
            },
          },
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
          kuvaus: {
            fi: 'Toteutuksen kuvaus',
          },
          tyyppi: 'yo',
        },
        muokkaaja: '1.2.246.562.24.62301161440',
        organisaatioOid: '1.1.1.1.1.1',
        kielivalinta: ['fi'],
        modified: '2019-03-26T10:19',
      },
      '2': {
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
            onkoMaksullinen: false,
            maksunMaara: null,
            opetustapaKoodiUrit: ['opetuspaikkakk_1#1'],
            opetusaikaKoodiUrit: [],
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
            alkamisaikaKuvaus: {
              fi: 'Alkamisaika kuvaus',
            },
            alkamiskausiKoodiUri: 'kausi_1#1',
            alkamisvuosi: '2024',
            onkoLukuvuosimaksua: true,
            lukuvuosimaksu: null,
            onkoStipendia: true,
            stipendinKuvaus: {
              fi: 'Stipendin kuvaus',
            },
            stipendinMaara: {
              fi: '90',
            },
          },
          osaamisalat: [],
          yhteyshenkilot: [],
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
          kuvaus: {
            fi: 'Toteutuksen kuvaus',
          },
          tyyppi: 'yo',
        },
        muokkaaja: '1.2.246.562.24.62301161440',
        organisaatioOid: '1.1.1.1.1.1',
        kielivalinta: ['fi'],
        modified: '2019-03-26T10:19',
      },
    },
  },
};
