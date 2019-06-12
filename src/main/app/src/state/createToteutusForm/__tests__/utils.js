import { getToteutusByValues, getValuesByToteutus } from '../utils';

test('getToteutusByValues returns correct toteutus given form values', () => {
  const toteutus = getToteutusByValues({
    nimi: {
      name: {
        fi: 'Fi nimi',
        sv: 'Sv nimi',
      },
    },
    kieliversiot: {
      languages: ['fi', 'sv'],
    },
    jarjestamispaikat: {
      jarjestajat: ['org1', 'org2'],
    },
    jarjestamistiedot: {
      kuvaus: {
        fi: 'Fi kuvaus',
        sv: 'Sv kuvaus',
      },
      maksullisuus: {
        tyyppi: 'kylla',
        maksu: '50.50',
      },
      opetustapa: ['opetustapa_1#1', 'opetustapa_2#1'],
      opetusaika: ['opetusaika_1#1', 'opetusaika_2#1'],
      opetuskieli: ['opetuskieli_1#1', 'opetuskieli_2#1'],
      opetusaikaKuvaus: {
        fi: 'Fi aikakuvaus',
        sv: 'Sv aikakuvaus',
      },
      opetustapaKuvaus: {
        fi: 'Fi tapakuvaus',
        sv: 'Sv tapakuvaus',
      },
      opetuskieliKuvaus: {
        fi: 'Fi kielikuvaus',
        sv: 'Sv kielikuvaus',
      },
      maksullisuusKuvaus: {
        fi: 'Fi maksullisuuskuvaus',
        sv: 'Sv maksullisuuskuvaus',
      },
      osiot: [{ value: 'osio_1#1' }, { value: 'osio_2#1' }],
      osioKuvaukset: {
        'osio_1#1': {
          fi: 'Fi kuvaus1',
          sv: 'Sv kuvaus1',
        },
        'osio_2#1': {
          fi: 'Fi kuvaus2',
          sv: 'Sv kuvaus2',
        },
      },
      alkamiskausi: {
        kausi: 'kausi_1#1',
        vuosi: { value: '2020' },
      },
      alkamiskausiKuvaus: {
        fi: 'Fi kausikuvaus',
        sv: 'Sv kausikuvaus',
      },
      onkoStipendia: true,
      stipendinMaara: { fi: '20e', sv: '20kr' },
      stipendinKuvaus: {
        fi: 'Fi stipendikuvaus',
        sv: 'Sv stipendikuvaus',
      },
    },
    nayttamistiedot: {
      ammattinimikkeet: {
        fi: [{ value: 'nimike1' }],
        sv: [{ value: 'nimike2' }],
      },
      avainsanat: {
        fi: [{ value: 'avainsana1' }],
        sv: [{ value: 'avainsana2' }],
      },
    },
    yhteyshenkilot: [
      {
        nimi: { fi: 'Fi nimi', sv: 'Sv nimi' },
        titteli: { fi: 'Fi titteli', sv: 'Sv titteli' },
        sahkoposti: { fi: 'Fi sähköposti', sv: 'Sv sähköposti' },
        puhelinnumero: { fi: 'Fi puhelinnumero', sv: 'Sv puhelinnumero' },
        verkkosivu: { fi: 'Fi verkkosivu', sv: 'Sv verkkosivu' },
      },
    ],
    osaamisalat: {
      osaamisalat: ['osaamisala1', 'osaamisala2'],
      osaamisalaLinkit: {
        osaamisala1: {
          fi: 'Fi linkki1',
          sv: 'Sv linkki1',
        },
        osaamisala2: {
          fi: 'Fi linkki2',
          sv: 'Sv linkki2',
        },
      },
      osaamisalaLinkkiOtsikot: {
        osaamisala1: {
          fi: 'Fi otsikko1',
          sv: 'Sv otsikko1',
        },
        osaamisala2: {
          fi: 'Fi otsikko2',
          sv: 'Sv otsikko2',
        },
      },
    },
    ylemmanKorkeakoulututkinnonOsaamisalat: [
      {
        nimi: { fi: 'Fi ylempinimi', sv: 'Sv ylempinimi' },
        kuvaus: { fi: 'Fi ylempikuvaus', sv: 'Sv ylempikuvaus' },
        linkki: { fi: 'Fi ylempilinkki', sv: 'Sv ylempilinkki' },
        otsikko: { fi: 'Fi ylempiotsikko', sv: 'Sv ylempiotsikko' },
      },
    ],
    alemmanKorkeakoulututkinnonOsaamisalat: [
      {
        nimi: { fi: 'Fi alempinimi', sv: 'Sv alempinimi' },
        kuvaus: { fi: 'Fi alempikuvaus', sv: 'Sv alempikuvaus' },
        linkki: { fi: 'Fi alempilinkki', sv: 'Sv alempilinkki' },
        otsikko: { fi: 'Fi alempiotsikko', sv: 'Sv alempiotsikko' },
      },
    ],
    kuvaus: {
      kuvaus: {
        fi: 'Fi kuvaus',
        sv: 'Sv kuvaus',
      },
    },
  });

  expect(toteutus).toMatchSnapshot();
});

test('getValuesByToteutus returns correct form values given toteutus', () => {
  const values = getValuesByToteutus({
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
        fi: 'Fi kuvaus',
        sv: 'Sv kuvaus',
      },
      opetus: {
        alkamisaikaKuvaus: {
          fi: 'Fi kausikuvaus',
          sv: 'Sv kausikuvaus',
        },
        alkamiskausiKoodiUri: 'kausi_1#1',
        alkamisvuosi: '2020',
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
        lukuvuosimaksu: 40.5,
        lukuvuosimaksuKuvaus: {
          fi: 'Fi maksukuvaus',
          sv: 'Sv maksukuvaus',
        },
        maksullisuusKuvaus: {
          fi: 'Fi maksullisuuskuvaus',
          sv: 'Sv maksullisuuskuvaus',
        },
        maksunMaara: 50.25,
        onkoLukuvuosimaksua: true,
        onkoMaksullinen: true,
        onkoStipendia: true,
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
        stipendinMaara: {
          fi: '20e',
          sv: '20kr',
        },
      },
      osaamisalat: [
        {
          koodi: 'osaamisala1',
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
          koodi: 'osaamisala2',
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
    },
    nimi: {
      fi: 'Fi nimi',
      sv: 'Sv nimi',
    },
    tarjoajat: ['org1', 'org2'],
  });

  expect(values).toMatchSnapshot();
});
