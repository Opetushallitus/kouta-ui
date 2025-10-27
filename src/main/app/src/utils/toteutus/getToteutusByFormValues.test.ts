import { parseEditorState } from '#/src/components/LexicalEditorUI/utils';
import {
  Alkamiskausityyppi,
  MaaraTyyppi,
  ApurahaYksikko,
  Hakeutumistapa,
  HAKULOMAKETYYPPI,
  JULKAISUTILA,
  KOULUTUSTYYPPI,
} from '#/src/constants';
import { MaksullisuusTyyppi } from '#/src/types/toteutusTypes';
import getToteutusByFormValues from '#/src/utils/toteutus/getToteutusByFormValues';

import { sisalto } from '../testFormData';

test('getToteutusByFormValues returns correct toteutus given form values', () => {
  const toteutus = getToteutusByFormValues({
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
      opintojenLaajuusNumero: '252',
      laajuusNumeroTyyppi: MaaraTyyppi.YKSI_ARVO,
      opintojenLaajuusNumeroMin: '300',
      opintojenLaajuusNumeroMax: '300',
      opintojenLaajuusyksikko: { value: 'laajuus_1#1' },
      jarjestetaanErityisopetuksena: false,
      ammatillinenPerustutkintoErityisopetuksena: false,
      taiteenalat: [
        { value: 'taiteenperusopetustaiteenala_sirkustaide' },
        { value: 'taiteenperusopetustaiteenala_sanataide' },
      ],
      hasJotpaRahoitus: false,
      isTyovoimakoulutus: false,
      isTaydennyskoulutus: false,
    },
    description: {
      kuvaus: {
        fi: parseEditorState('Fi toteutuksenkuvaus'),
        sv: parseEditorState('Sv toteutuksenkuvaus'),
      },
      osaamistavoitteet: {
        fi: parseEditorState('Fi osaamistavoitteet'),
        sv: parseEditorState('Sv osaamistavoitteet'),
      },
    },
    kieliversiot: ['fi', 'sv'],
    tarjoajat: ['org1', 'org2'],
    jarjestamistiedot: {
      maksullisuustyyppi: MaksullisuusTyyppi.LUKUVUOSIMAKSU,
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
      apurahaMaaraTyyppi: MaaraTyyppi.VAIHTELUVALI,
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
        verkkosivuTeksti: {},
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
        sisalto: sisalto,
      },
    ],
    hakeutumisTaiIlmoittautumistapa: {
      hakeutumisTaiIlmoittautumistapa: HAKULOMAKETYYPPI.MUU,
      isHakukohteetKaytossa: false,
      hakuTapa: Hakeutumistapa.ILMOITTAUTUMINEN,
      lisatiedot: {
        fi: parseEditorState('<p>Fi lisatiedot</p>'),
        sv: parseEditorState('<p>Sv sisalto</p>'),
      },
      aloituspaikat: '56',
      aloituspaikkakuvaus: {
        fi: parseEditorState('aloituspaikan kuvaus fi'),
        sv: parseEditorState('aloituspaikan kuvaus sv'),
      },
    },
  });

  expect(toteutus).toMatchSnapshot();
});
