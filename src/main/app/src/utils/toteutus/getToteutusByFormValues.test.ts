import { parseEditorState } from '#/src/components/Editor/utils';
import {
  Alkamiskausityyppi,
  ApurahaMaaraTyyppi,
  ApurahaYksikko,
  Hakeutumistapa,
  HAKULOMAKETYYPPI,
  JULKAISUTILA,
  KOULUTUSTYYPPI,
} from '#/src/constants';
import { MaksullisuusTyyppi } from '#/src/types/toteutusTypes';
import getToteutusByFormValues from '#/src/utils/toteutus/getToteutusByFormValues';

test('getToteutusByFormValues returns correct toteutus given form values', () => {
  const toteutus = getToteutusByFormValues(
    {
      externalId: 'ext1',
      tila: JULKAISUTILA.JULKAISTU,
      koulutustyyppi: KOULUTUSTYYPPI.AMKKOULUTUS,
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
        opintojenLaajuusnumero: '252',
        opintojenLaajuusyksikko: { value: 'laajuus_1#1' },
        jarjestetaanErityisopetuksena: false,
        ammatillinenPerustutkintoErityisopetuksena: false,
      },
      kuvaus: {
        fi: parseEditorState('Fi toteutuksenkuvaus'),
        sv: parseEditorState('Sv toteutuksenkuvaus'),
      },
      kieliversiot: ['fi', 'sv'],
      tarjoajat: ['org1', 'org2'],
      jarjestamistiedot: {
        maksullisuustyyppi: MaksullisuusTyyppi.MAKSULLINEN,
        maksunMaara: 50.5,
        maksullisuusKuvaus: {
          fi: parseEditorState('Fi maksullisuuskuvaus'),
          sv: parseEditorState('Sv maksullisuuskuvaus'),
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
        onkoApuraha: true,
        apurahaMin: 100,
        apurahaMax: 200,
        apurahaMaaraTyyppi: ApurahaMaaraTyyppi.VAIHTELUVALI,
        apurahaYksikko: { value: ApurahaYksikko.EURO },
        apurahaKuvaus: {
          fi: parseEditorState('Fi apurahakuvaus'),
          sv: parseEditorState('Sv apurahakuvaus'),
        },
        diplomit: {
          valinnat: [
            { value: 'moduulikoodistolops2021_kald3#1' },
            { value: 'moduulikoodistolops2021_tald7#1' },
          ],
          linkit: [
            {
              url: {
                fi: 'http://linkki1.fi',
                sv: 'http://link1.se',
              },
              alt: {
                fi: 'Suomeksi 1',
                sv: 'På svenska 1',
              },
            },
            {
              url: {
                fi: 'http://linkki2.fi',
                sv: 'http://link2.se',
              },
              alt: {
                fi: 'Suomeksi 2',
                sv: 'På svenska 2',
              },
            },
          ],
        },
        kielivalikoima: {
          A1Kielet: [{ value: 'kieli_1#1' }],
          A2Kielet: [{ value: 'kieli_2#1' }],
          B1Kielet: [{ value: 'kieli_3#1' }],
          B2Kielet: [{ value: 'kieli_4#1' }],
          B3Kielet: [{ value: 'kieli_5#1' }],
          aidinkielet: [{ value: 'kieli_6#1' }],
          muutKielet: [{ value: 'kieli_7#1' }],
        },
        ajankohta: {
          ajankohtaTyyppi: Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI,
          kausi: 'alkamiskausi_1#1',
          vuosi: { value: '2020' },
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
        yleislinja: true,
        painotukset: {
          kaytossa: true,
          valinnat: [{ value: 'painotus_1#1' }, { value: 'painotus_2#1' }],
          kuvaukset: {
            'painotus_1#1': {
              fi: parseEditorState('Fi painotus 1 kuvaus'),
              sv: parseEditorState('Sv painotus 1 kuvaus'),
            },
            'painotus_2#1': {
              fi: parseEditorState('Fi painotus 2 kuvaus'),
              sv: parseEditorState('Sv painotus 2 kuvaus'),
            },
          },
        },
        erityisetKoulutustehtavat: {
          kaytossa: true,
          valinnat: [
            { value: 'erityinenkoulutustehtava_1#1' },
            { value: 'erityinenkoulutustehtava_2#1' },
          ],
          kuvaukset: {
            'erityinenkoulutustehtava_1#1': {
              fi: parseEditorState('Fi erityinen koulutustehtävä 1 kuvaus'),
              sv: parseEditorState('Sv erityinen koulutustehtävä 1 kuvaus'),
            },
            'erityinenkoulutustehtava_2#1': {
              fi: parseEditorState('Fi erityinen koulutustehtävä 2 kuvaus'),
              sv: parseEditorState('Sv erityinen koulutustehtävä 2 kuvaus'),
            },
          },
        },
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
      hakeutumisTaiIlmoittautumistapa: {
        hakeutumisTaiIlmoittautumistapa: HAKULOMAKETYYPPI.MUU,
        hakuTapa: Hakeutumistapa.ILMOITTAUTUMINEN,
        lisatiedot: {
          fi: parseEditorState('<p>Fi lisatiedot</p>'),
          sv: parseEditorState('<p>Sv sisalto</p>'),
        },
      },
    },
    {
      osaamisalat: [
        {
          arvo: '1',
          uri: 'osaamisala1',
        },
        {
          arvo: '2',
          uri: 'osaamisala2',
        },
      ],
    }
  );

  expect(toteutus).toMatchSnapshot();
});
