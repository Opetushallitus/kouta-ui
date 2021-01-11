import getToteutusByFormValues from '#/src/utils/toteutus/getToteutusByFormValues';
import { parseEditorState } from '#/src/components/Editor/utils';

test('getToteutusByFormValues returns correct toteutus given form values', () => {
  const toteutus = getToteutusByFormValues({
    koulutustyyppi: 'amk',
    tiedot: {
      nimi: {
        fi: 'Fi nimi',
        sv: 'Sv nimi',
      },
      ilmoittautumislinkki: {
        fi: 'Fi linkki',
        sv: 'Sv linkki',
      },
      aloituspaikat: '56',
      laajuus: '252',
      laajuusyksikko: { value: 'laajuus_1#1' },
    },
    kuvaus: {
      fi: parseEditorState('Fi toteutuksenkuvaus'),
      sv: parseEditorState('Sv toteutuksenkuvaus'),
    },
    kieliversiot: ['fi', 'sv'],
    tarjoajat: ['org1', 'org2'],
    jarjestamistiedot: {
      maksullisuus: {
        tyyppi: 'kylla',
        maksu: '50.50',
      },
      opetustapa: ['opetustapa_1#1', 'opetustapa_2#1'],
      opetusaika: ['opetusaika_1#1', 'opetusaika_2#1'],
      opetuskieli: [
        'oppilaitoksenopetuskieli_1#1',
        'oppilaitoksenopetuskieli_2#1',
        'oppilaitoksenopetuskieli_4#1',
      ],
      suunniteltuKesto: {
        vuotta: 2,
        kuukautta: 6,
      },
      suunniteltuKestoKuvaus: {
        fi: parseEditorState('Fi aikakuvaus'),
        sv: parseEditorState('Sv aikakuvaus'),
      },
      opetusaikaKuvaus: {
        fi: parseEditorState('Fi aikakuvaus'),
        sv: parseEditorState('Sv aikakuvaus'),
      },
      opetustapaKuvaus: {
        fi: parseEditorState('Fi tapakuvaus'),
        sv: parseEditorState('Sv tapakuvaus'),
      },
      opetuskieliKuvaus: {
        fi: parseEditorState('Fi kielikuvaus'),
        sv: parseEditorState('Sv kielikuvaus'),
      },
      maksullisuusKuvaus: {
        fi: parseEditorState('Fi maksullisuuskuvaus'),
        sv: parseEditorState('Sv maksullisuuskuvaus'),
      },
      osiot: [{ value: 'osio_1#1' }, { value: 'osio_2#1' }],
      osioKuvaukset: {
        'osio_1#1': {
          fi: parseEditorState('Fi kuvaus1'),
          sv: parseEditorState('Sv kuvaus1'),
        },
        'osio_2#1': {
          fi: parseEditorState('Fi kuvaus2'),
          sv: parseEditorState('Sv kuvaus2'),
        },
      },
      koulutuksenAlkamispaivamaara: null,
      koulutuksenPaattymispaivamaara: null,
      koulutuksenTarkkaAlkamisaika: false,
      koulutuksenAlkamisvuosi: {
        value: '2020',
      },
      koulutuksenAlkamiskausi: 'kausi_0#1',
      onkoStipendia: 'kylla',
      stipendinMaara: 20,
      stipendinKuvaus: {
        fi: parseEditorState('Fi stipendikuvaus'),
        sv: parseEditorState('Sv stipendikuvaus'),
      },
      diplomiTyypit: [{ value: 'diplomi_1#1' }, { value: 'diplomi_2#1' }],
      diplomiKuvaus: {
        fi: parseEditorState('Fi diplomi'),
        sv: parseEditorState('Sv diplomi'),
      },
      A1A2Kielet: [{ value: 'kieli_1#1' }],
      B2Kielet: [{ value: 'kieli_2#1' }],
      aidinkielet: [{ value: 'kieli_3#1' }],
      B1Kielet: [{ value: 'kieli_4#1' }],
      B3Kielet: [{ value: 'kieli_5#1' }],
      muutKielet: [{ value: 'kieli_6#1' }],
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
        kuvaus: {
          fi: parseEditorState('Fi ylempikuvaus'),
          sv: parseEditorState('Sv ylempikuvaus'),
        },
        linkki: { fi: 'Fi ylempilinkki', sv: 'Sv ylempilinkki' },
        otsikko: { fi: 'Fi ylempiotsikko', sv: 'Sv ylempiotsikko' },
      },
    ],
    alemmanKorkeakoulututkinnonOsaamisalat: [
      {
        nimi: { fi: 'Fi alempinimi', sv: 'Sv alempinimi' },
        kuvaus: {
          fi: parseEditorState('Fi alempikuvaus'),
          sv: parseEditorState('Sv alempikuvaus'),
        },
        linkki: { fi: 'Fi alempilinkki', sv: 'Sv alempilinkki' },
        otsikko: { fi: 'Fi alempiotsikko', sv: 'Sv alempiotsikko' },
      },
    ],
    lukiolinjat: {
      lukiolinja: { value: 'linja_1#1' },
    },
    toteutusjaksot: [
      {
        nimi: {
          fi: 'Fi nimi',
          sv: 'Sv nimi',
        },
        koodi: 'koodi 123',
        laajuus: {
          fi: 'Fi laajuus',
          sv: 'Sv laajuus',
        },
        kuvaus: {
          fi: parseEditorState('Fi kuvaus'),
          sv: parseEditorState('Sv kuvaus'),
        },
        ilmoittautumislinkki: {
          fi: 'Fi linkki',
          sv: 'Sv linkki',
        },
        sisalto: [
          {
            tyyppi: 'teksti',
            data: {
              fi: parseEditorState('<h2>Fi sisalto</h2>'),
              sv: parseEditorState('<h2>Sv sisalto</h2>'),
            },
          },
          {
            tyyppi: 'taulukko',
            data: {
              rows: [
                {
                  columns: [
                    { text: { fi: 'Fi column1', sv: 'Sv column1' } },
                    { text: { fi: 'Fi column2', sv: 'Sv column2' } },
                  ],
                },
                {
                  columns: [
                    { text: { fi: 'Fi column3', sv: 'Sv column3' } },
                    { text: { fi: 'Fi column4', sv: 'Sv column4' } },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
    tutkinnonOsat: [
      {
        tutkinto: { value: 'tutkinto_1#1' },
        osaamisala: { value: 'osaamisala_1#1' },
        tutkinnonOsat: [{ value: 'tutkinnonosa_1#1' }],
      },
    ],
  });

  expect(toteutus).toMatchSnapshot();
});
