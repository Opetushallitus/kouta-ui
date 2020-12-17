import { Alkamiskausityyppi, JULKAISUTILA } from '#/src/constants';
import getFormValuesByToteutus from '#/src/utils/toteutus/getFormValuesByToteutus';

test('getFormValuesByToteutus returns correct form values given toteutus', () => {
  const values = getFormValuesByToteutus({
    tila: JULKAISUTILA.TALLENNETTU,
    kielivalinta: ['fi', 'sv'],
    metadata: {
      alemmanKorkeakoulututkinnonOsaamisalat: [
        {
          kuvaus: {
            fi: 'Fi alempikuvaus',
            sv: 'Sv alempikuvaus',
          },
          linkki: {
            fi: 'Fi alempilinkki',
            sv: 'Sv alempilinkki',
          },
          nimi: {
            fi: 'Fi alempinimi',
            sv: 'Sv alempinimi',
          },
          otsikko: {
            fi: 'Fi alempiotsikko',
            sv: 'Sv alempiotsikko',
          },
        },
      ],
      ammattinimikkeet: [
        {
          arvo: 'nimike1',
          kieli: 'fi',
        },
        {
          arvo: 'nimike2',
          kieli: 'sv',
        },
      ],
      asiasanat: [
        {
          arvo: 'avainsana1',
          kieli: 'fi',
        },
        {
          arvo: 'avainsana2',
          kieli: 'sv',
        },
      ],
      kuvaus: {
        fi: 'Fi toteutuksenkuvaus',
        sv: 'Sv toteutuksenkuvaus',
      },
      opetus: {
        koulutuksenAlkamiskausi: {
          alkamiskausityyppi: Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA,
          koulutuksenAlkamiskausiKoodiUri: 'kausi_0#1',
          koulutuksenAlkamispaivamaara: '2021-04-16T00:00',
          kouutuksenPaattymispaivamaara: '2021-12-12T00:00',
          koulutuksenAlkamisvuosi: 2020,
        },
        lisatiedot: [
          {
            otsikkoKoodiUri: 'osio_1#1',
            teksti: {
              fi: 'Fi kuvaus1',
              sv: 'Sv kuvaus1',
            },
          },
          {
            otsikkoKoodiUri: 'osio_2#1',
            teksti: {
              fi: 'Fi kuvaus2',
              sv: 'Sv kuvaus2',
            },
          },
        ],
        maksullisuus: {
          maksu: '',
        },
        maksumaara: {},
        maksullisuusKuvaus: {
          fi: 'Fi maksullisuuskuvaus',
          sv: 'Sv maksullisuuskuvaus',
        },
        onkoMaksullinen: true,
        onkoStipendia: true,
        suunniteltuKestoKuvaus: {
          fi: 'Fi suunniteltuKestoKuvaus',
          sv: 'Sv suunniteltuKestoKuvaus',
        },
        suunniteltuKestoVuodet: 2,
        suunniteltuKestoKuukaudet: 6,
        opetusaikaKoodiUrit: ['opetusaika_1#1'],
        opetusaikaKuvaus: {
          fi: 'Fi aikakuvaus',
          sv: 'Sv aikakuvaus',
        },
        opetuskieletKuvaus: {
          fi: 'Fi kielikuvaus',
          sv: 'Sv kielikuvaus',
        },
        opetuskieliKoodiUrit: ['opetuskieli_1#1', 'opetuskieli_2#1'],
        opetustapaKoodiUrit: ['opetustapa_1#1', 'opetustapa_2#1'],
        opetustapaKuvaus: {
          fi: 'Fi tapakuvaus',
          sv: 'Sv tapakuvaus',
        },
        stipendinKuvaus: {
          fi: 'Fi stipendikuvaus',
          sv: 'Sv stipendikuvaus',
        },
        stipendinMaara: 20,
        diplomiKoodiUrit: ['dipmlomi_1#1'],
        diplomiKuvaus: {
          fi: 'Fi diplomi',
          sv: 'Sv diplomi',
        },
        A1JaA2Kielivalikoima: ['kieli_1#1'],
        B2Kielivalikoima: ['kieli_2#1'],
        B1Kielivalikoima: ['kieli_3#1'],
        B3Kielivalikoima: ['kieli_4#1'],
        aidinkieliKielivalikoima: ['kieli_5#1'],
        muuKielivalikoima: ['kieli_6#1'],
      },
      osaamisalat: [
        {
          koodiUri: 'osaamisala1',
          linkki: {
            fi: 'Fi linkki1',
            sv: 'Sv linkki1',
          },
          otsikko: {
            fi: 'Fi otsikko1',
            sv: 'Sv otsikko1',
          },
        },
        {
          koodiUri: 'osaamisala2',
          linkki: {
            fi: 'Fi linkki2',
            sv: 'Sv linkki2',
          },
          otsikko: {
            fi: 'Fi otsikko2',
            sv: 'Sv otsikko2',
          },
        },
      ],
      yhteyshenkilot: [
        {
          nimi: {
            fi: 'Fi nimi',
            sv: 'Sv nimi',
          },
          puhelinnumero: {
            fi: 'Fi puhelinnumero',
            sv: 'Sv puhelinnumero',
          },
          sahkoposti: {
            fi: 'Fi sähköposti',
            sv: 'Sv sähköposti',
          },
          titteli: {
            fi: 'Fi titteli',
            sv: 'Sv titteli',
          },
          wwwSivu: {
            fi: 'Fi verkkosivu',
            sv: 'Sv verkkosivu',
          },
        },
      ],
      ylemmanKorkeakoulututkinnonOsaamisalat: [
        {
          kuvaus: {
            fi: 'Fi ylempikuvaus',
            sv: 'Sv ylempikuvaus',
          },
          linkki: {
            fi: 'Fi ylempilinkki',
            sv: 'Sv ylempilinkki',
          },
          nimi: {
            fi: 'Fi ylempinimi',
            sv: 'Sv ylempinimi',
          },
          otsikko: {
            fi: 'Fi ylempiotsikko',
            sv: 'Sv ylempiotsikko',
          },
        },
      ],
      lukiolinjaKoodiUri: 'linja_1#1',
      tutkinnonOsat: [
        {
          osaamisalaKoodiUri: 'osaamisala_1#1',
          tutkinnonOsaKoodiUrit: ['tutkinnonosa_1#1'],
          tutkintoKoodiUri: 'tutkinto_1#1',
        },
      ],
      laajuus: 25,
      laajuusyksikkoKoodiUri: 'laajuus_1#1',
      ilmoittautumislinkki: {
        fi: 'Fi linkki',
        sv: 'Sv linkki',
      },
      aloituspaikat: 251,
      suunniteltuKesto: {
        fi: 'Fi kesto',
        sv: 'Sv kesto',
      },
      toteutusjaksot: [
        {
          ilmoittautumislinkki: {
            fi: 'Fi linkki',
            sv: 'Sv linkki',
          },
          koodi: 'koodi 123',
          kuvaus: {
            fi: 'Fi kuvaus',
            sv: 'Sv kuvaus',
          },
          laajuus: {
            fi: 'Fi laajuus',
            sv: 'Sv laajuus',
          },
          nimi: {
            fi: 'Fi nimi',
            sv: 'Sv nimi',
          },
          sisalto: [
            {
              data: {
                fi: '<h2>Fi sisalto</h2>',
                sv: '<h2>Sv sisalto</h2>',
              },
              tyyppi: 'teksti',
            },
            {
              data: {
                rows: [
                  {
                    columns: [
                      {
                        index: 0,
                        text: {
                          fi: 'Fi column1',
                          sv: 'Sv column1',
                        },
                      },
                      {
                        index: 1,
                        text: {
                          fi: 'Fi column2',
                          sv: 'Sv column2',
                        },
                      },
                    ],
                    index: 0,
                  },
                  {
                    columns: [
                      {
                        index: 0,
                        text: {
                          fi: 'Fi column3',
                          sv: 'Sv column3',
                        },
                      },
                      {
                        index: 1,
                        text: {
                          fi: 'Fi column4',
                          sv: 'Sv column4',
                        },
                      },
                    ],
                    index: 1,
                  },
                ],
              },
              tyyppi: 'taulukko',
            },
          ],
        },
      ],
    },
    nimi: {
      fi: 'Fi nimi',
      sv: 'Sv nimi',
    },
    kuvaus: {
      fi: 'Fi toteutuksenkuvaus',
      sv: 'Sv toteutuksenkuvaus',
    },
    tarjoajat: ['org1', 'org2'],
  });

  expect(values).toMatchSnapshot();
});
