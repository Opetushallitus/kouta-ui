import { parseEditorState } from '../components/LexicalEditorUI/utils';
import {
  Alkamiskausityyppi,
  HAKULOMAKETYYPPI,
  JULKAISUTILA,
  LIITTEEN_TOIMITUSTAPA,
} from '../constants';
import { HakukohdeFormValues } from '../types/hakukohdeTypes';

const valintaTilaisuus = {
  osoite: { fi: 'fi osoite', sv: 'sv osoite' },
  postinumero: { value: 'posti_1#1' },
  alkaa: '2019-04-16T08:44',
  paattyy: '2019-04-18T08:44',
  lisatietoja: {
    fi: parseEditorState('<p>fi lisatietoja</p>'),
    sv: parseEditorState('<p>sv lisatietoja</p>'),
  },
  jarjestamispaikka: {
    fi: 'jarjestamispaikka - fi',
    sv: 'jarjestamispaikka - sv',
  },
};

const valintakoe = {
  nimi: { fi: 'nimi - fi', sv: 'nimi - sv' },
  tyyppi: {
    value: 'tyyppi_1#1',
  },
  tietoaHakijalle: {
    fi: parseEditorState('<p>Tietoa hakijalle - fi</p>'),
    sv: parseEditorState('<p>Tietoa hakijalle - sv</p>'),
  },
  vahimmaispistemaara: '30,4',
  liittyyEnnakkovalmistautumista: true,
  ohjeetEnnakkovalmistautumiseen: {
    fi: parseEditorState('<p>Ohjeet ennakkovalmistautumiseen - fi</p>'),
    sv: parseEditorState('<p>ohjeet ennakkovalmistautumiseen - sv</p>'),
  },
  erityisjarjestelytMahdollisia: true,
  ohjeetErityisjarjestelyihin: {
    fi: parseEditorState('<p>Ohjeet erityisjärjestelyihin - fi</p>'),
    sv: parseEditorState('<p>Ohjeet erityisjärjestelyihin - sv</p>'),
  },
  tilaisuudet: [valintaTilaisuus],
};

const valintakokeet = {
  yleisKuvaus: {
    fi: parseEditorState('<p>Yleiskuvaus - fi</p>'),
    sv: parseEditorState('<p>Yleiskuvaus - sv</p>'),
  },
  kokeetTaiLisanaytot: [valintakoe],
};

const valintaTilaisuusWithExtraTranslation = {
  ...valintaTilaisuus,
  osoite: { fi: 'fi osoite', sv: 'sv osoite', en: 'en osoite' },
  lisatietoja: {
    fi: parseEditorState('<p>fi lisatietoja</p>'),
    sv: parseEditorState('<p>sv lisatietoja</p>'),
    en: parseEditorState('<p>en lisatietoja</p>'),
  },
  jarjestamispaikka: {
    fi: 'jarjestamispaikka - fi',
    sv: 'jarjestamispaikka - sv',
    en: 'jarjestamispaikka - en',
  },
};

const valintaKoeWithExtraTranslations = {
  ...valintakoe,
  nimi: { fi: 'nimi - fi', sv: 'nimi - sv', en: 'nimi - en' },
  tietoaHakijalle: {
    fi: parseEditorState('<p>Tietoa hakijalle - fi</p>'),
    sv: parseEditorState('<p>Tietoa hakijalle - sv</p>'),
    en: parseEditorState('<p>Tietoa hakijalle - en</p>'),
  },
  ohjeetEnnakkovalmistautumiseen: {
    fi: parseEditorState('<p>Ohjeet ennakkovalmistautumiseen - fi</p>'),
    sv: parseEditorState('<p>ohjeet ennakkovalmistautumiseen - sv</p>'),
    en: parseEditorState('<p>ohjeet ennakkovalmistautumiseen - en</p>'),
  },
  ohjeetErityisjarjestelyihin: {
    fi: parseEditorState('<p>Ohjeet erityisjärjestelyihin - fi</p>'),
    sv: parseEditorState('<p>Ohjeet erityisjärjestelyihin - sv</p>'),
    en: parseEditorState('<p>Ohjeet erityisjärjestelyihin - en</p>'),
  },
  tilaisuudet: [valintaTilaisuusWithExtraTranslation],
};

export const valintakokeetWithExtraTranslations = {
  yleisKuvaus: {
    fi: parseEditorState('<p>Yleiskuvaus - fi</p>'),
    sv: parseEditorState('<p>Yleiskuvaus - sv</p>'),
    en: parseEditorState('<p>Yleiskuvaus - en</p>'),
  },
  kokeetTaiLisanaytot: [valintaKoeWithExtraTranslations],
};

const liite = {
  tyyppi: { value: 'liitetyyppi_1#1' },
  nimi: {
    fi: 'Fi nimi',
    sv: 'Sv nimi',
  },
  kuvaus: {
    fi: parseEditorState('Fi kuvaus'),
    sv: parseEditorState('Sv kuvaus'),
  },
  toimitusaika: '2019-08-17T05:52',
  toimitustapa: {
    tapa: LIITTEEN_TOIMITUSTAPA.MUU_OSOITE,
    paikka: {
      osoite: {
        rivi1: {
          fi: 'Fi osoite',
          sv: 'Sv osoite',
        },
        rivi2: {},
      },
      postinumero: { value: 'posti_1#1' },
      sahkoposti: {
        fi: 'Fi sahkoposti',
        sv: 'Sv sahkoposti',
      },
      verkkosivu: 'https://liitelomake.fi',
    },
  },
};

export const BASE_HAKUKOHDE_FORMDATA: HakukohdeFormValues = {
  externalId: 'ext1',
  jarjestaaUrheilijanAmmKoulutusta: false,
  uudenOpiskelijanUrl: {
    fi: 'https://opiskelu.fi',
    sv: 'https://opiskelu.se',
  },
  tila: JULKAISUTILA.TALLENNETTU,
  muokkaaja: '1.1.1.1',
  kieliversiot: ['fi', 'sv'],
  aloituspaikat: {
    aloituspaikkamaara: '45',
    ensikertalaismaara: '29',
    aloituspaikkakuvaus: {
      fi: parseEditorState('aloituspaikan kuvaus fi'),
      sv: parseEditorState('aloituspaikan kuvaus sv'),
    },
  },
  hakuajat: {
    eriHakuaika: true,
    hakuajat: [
      {
        alkaa: '2019-04-17T05:52',
        paattyy: '2019-04-22T05:52',
      },
      {
        alkaa: '2019-05-17T05:52',
        paattyy: '2019-05-18T05:52',
      },
    ],
  },
  perustiedot: {
    nimi: { fi: 'Fi nimi', sv: 'Sv nimi' },
    voiSuorittaaKaksoistutkinnon: true,
  },
  pohjakoulutus: {
    pohjakoulutusvaatimus: [
      { value: 'vaatimus_1#1' },
      { value: 'vaatimus_2#1' },
    ],
    tarkenne: {
      fi: parseEditorState('<strong>Tarkenne fi</strong>'),
      sv: parseEditorState('<strong>Tarkenne sv</strong>'),
    },
  },
  valintaperusteenKuvaus: {
    valintaperuste: { value: 'peruste_1#1' },
    kynnysehto: {
      fi: parseEditorState('<p>Hakukohteen kynnysehto - fi</p>'),
      sv: parseEditorState('<p>Hakukohteen kynnysehto - sv</p>'),
    },
  },
  jarjestyspaikkaOid: '2.2.2.2.2',
  ajankohta: {
    kaytetaanHakukohteenAlkamiskautta: true,
    ajankohtaTyyppi: Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI,
    kausi: 'alkamiskausi_1#1',
    vuosi: { value: '2020' },
  },
  valintakokeet: {
    yleisKuvaus: {
      fi: parseEditorState('<p>Yleiskuvaus - fi</p>'),
      sv: parseEditorState('<p>Yleiskuvaus - sv</p>'),
    },
    valintaperusteenValintakokeidenLisatilaisuudet: {
      '123-123': [valintaTilaisuus],
    },
    kokeetTaiLisanaytot: [valintakoe],
  },
  liitteet: {
    toimitustapa: {
      tapa: LIITTEEN_TOIMITUSTAPA.MUU_OSOITE,
      paikka: {
        osoite: {
          rivi1: {
            fi: 'Fi osoite',
            sv: 'Sv osoite',
          },
          rivi2: {},
        },
        postinumero: { value: 'posti_1#1' },
        sahkoposti: {
          fi: 'Fi sahkoposti',
          sv: 'Sv sahkoposti',
        },
        verkkosivu: 'https://liitelomake.fi',
      },
    },
    yhteinenToimituspaikka: false,
    yhteinenToimitusaika: false,
    toimitusaika: '2019-04-17T05:52',
    liitteet: [liite],
  },
  hakulomake: {
    eriHakulomake: true,
    tyyppi: HAKULOMAKETYYPPI.ATARU,
    lomake: {
      value: '12345',
    },
  },
  hakukohteenLinja: {
    linja: 'lukiopainotukset_0104#1',
    alinHyvaksyttyKeskiarvo: '6,5',
    lisatietoa: {
      fi: parseEditorState('Fi lisatietoa'),
      sv: parseEditorState('Sv lisatietoa'),
    },
    painotetutArvosanat: [
      {
        painotettuOppiaine: {
          value: 'painotettavatoppiaineetlukiossa_a1en#1',
          label: 'A1 englanti',
        },
        painokerroin: '1.2',
      },
    ],
  },
};

export const hakukohdeFormValuesWithExtraTranslations: HakukohdeFormValues = {
  ...BASE_HAKUKOHDE_FORMDATA,
  aloituspaikat: {
    aloituspaikkamaara: '45',
    ensikertalaismaara: '29',
    aloituspaikkakuvaus: {
      fi: parseEditorState('aloituspaikan kuvaus fi'),
      sv: parseEditorState('aloituspaikan kuvaus sv'),
      en: parseEditorState('aloituspaikan kuvaus en'),
    },
  },
  perustiedot: {
    nimi: { fi: 'Fi nimi', sv: 'Sv nimi', en: 'En nimi' },
    voiSuorittaaKaksoistutkinnon: true,
  },
  pohjakoulutus: {
    pohjakoulutusvaatimus: [
      { value: 'vaatimus_1#1' },
      { value: 'vaatimus_2#1' },
    ],
    tarkenne: {
      fi: parseEditorState('<strong>Tarkenne fi</strong>'),
      sv: parseEditorState('<strong>Tarkenne sv</strong>'),
      en: parseEditorState('<strong>Tarkenne en</strong>'),
    },
  },
  valintaperusteenKuvaus: {
    valintaperuste: { value: 'peruste_1#1' },
    kynnysehto: {
      fi: parseEditorState('<p>Hakukohteen kynnysehto - fi</p>'),
      sv: parseEditorState('<p>Hakukohteen kynnysehto - sv</p>'),
      en: parseEditorState('<p>Hakukohteen kynnysehto - en</p>'),
    },
  },
  jarjestyspaikkaOid: '2.2.2.2.2',
  ajankohta: {
    kaytetaanHakukohteenAlkamiskautta: true,
    ajankohtaTyyppi: Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI,
    kausi: 'alkamiskausi_1#1',
    vuosi: { value: '2020' },
  },
  valintakokeet: {
    yleisKuvaus: {
      fi: parseEditorState('<p>Yleiskuvaus - fi</p>'),
      sv: parseEditorState('<p>Yleiskuvaus - sv</p>'),
      en: parseEditorState('<p>Yleiskuvaus - en</p>'),
    },
    valintaperusteenValintakokeidenLisatilaisuudet: {
      '123-123': [valintaTilaisuusWithExtraTranslation],
    },
    kokeetTaiLisanaytot: [valintaKoeWithExtraTranslations],
  },
  liitteet: {
    toimitustapa: {
      tapa: LIITTEEN_TOIMITUSTAPA.MUU_OSOITE,
      paikka: {
        osoite: {
          rivi1: {
            fi: 'Fi osoite',
            sv: 'Sv osoite',
            en: 'En osoite',
          },
          rivi2: {},
        },
        postinumero: { value: 'posti_1#1' },
        sahkoposti: {
          fi: 'Fi sahkoposti',
          sv: 'Sv sahkoposti',
          en: 'En sahkoposti',
        },
        verkkosivu: 'https://liitelomake.fi',
      },
    },
    yhteinenToimituspaikka: false,
    yhteinenToimitusaika: false,
    toimitusaika: '2019-04-17T05:52',
    liitteet: [
      {
        ...liite,
        nimi: {
          fi: 'Fi nimi',
          sv: 'Sv nimi',
          en: 'En nimi',
        },
        kuvaus: {
          fi: parseEditorState('Fi kuvaus'),
          sv: parseEditorState('Sv kuvaus'),
          en: parseEditorState('En kuvaus'),
        },
      },
    ],
  },
  hakukohteenLinja: {
    linja: 'lukiopainotukset_0104#1',
    alinHyvaksyttyKeskiarvo: '6,5',
    lisatietoa: {
      fi: parseEditorState('Fi lisatietoa'),
      sv: parseEditorState('Sv lisatietoa'),
      en: parseEditorState('En lisatietoa'),
    },
    painotetutArvosanat: [
      {
        painotettuOppiaine: {
          value: 'painotettavatoppiaineetlukiossa_a1en#1',
          label: 'A1 englanti',
        },
        painokerroin: '1.2',
      },
    ],
  },
};

export const BASE_VALINTAPERUSTE_FORM_DATA = {
  perustiedot: {
    tyyppi: 'amk',
    kieliversiot: ['fi', 'sv'],
    hakutapa: 'tapa_1#1',
    kohdejoukko: { value: 'joukko_1#1' },
  },
  kuvaus: {
    nimi: {
      fi: 'Fi nimi',
      sv: 'Sv nimi',
    },
    kuvaus: {
      fi: parseEditorState('<h1>Fi kuvaus</h1>'),
      sv: parseEditorState('<h1>Sv kuvaus</h2>'),
    },
  },
  hakukelpoisuus: {
    fi: parseEditorState('<h1>Fi hakukelpoisuus</h1>'),
    sv: parseEditorState('<h1>Sv hakukelpoisuus</h2>'),
  },
  lisatiedot: {
    fi: parseEditorState('<h1>Fi lisatiedot</h1>'),
    sv: parseEditorState('<h1>Sv lisatiedot</h2>'),
  },
  valintatavat: [{}],
  julkinen: true,
  valintakokeet: valintakokeet,
  tila: 'julkaistu',
};

export const sisalto = [
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
];

export const valintatapa = {
  nimi: {
    fi: 'Fi nimi',
    sv: 'Sv nimi',
  },
  kynnysehto: {
    fi: parseEditorState('<p>Fi kynnysehto</p>'),
    sv: parseEditorState('<p>Sv kynnysehto</p>'),
  },
  tapa: { value: 'tapa_1#1' },
  enimmaispistemaara: '20,2',
  vahimmaispistemaara: '10,1',
  sisalto: sisalto,
};

export const valintatapaWithExtraTranslations = {
  ...valintatapa,
  kynnysehto: {
    fi: parseEditorState('<p>Fi kynnysehto</p>'),
    sv: parseEditorState('<p>Sv kynnysehto</p>'),
    en: parseEditorState('<p>En kynnysehto</p>'),
  },
  sisalto: [
    {
      tyyppi: 'teksti',
      data: {
        fi: parseEditorState('<h2>Fi sisalto</h2>'),
        sv: parseEditorState('<h2>Sv sisalto</h2>'),
        en: parseEditorState('<h2>En sisalto</h2>'),
      },
    },
    {
      tyyppi: 'taulukko',
      data: {
        rows: [
          {
            columns: [
              {
                text: { fi: 'Fi column1', sv: 'Sv column1', en: 'En column1' },
              },
              {
                text: { fi: 'Fi column2', sv: 'Sv column2', en: 'En column2' },
              },
            ],
          },
          {
            columns: [
              {
                text: { fi: 'Fi column3', sv: 'Sv column3', en: 'En column3' },
              },
              {
                text: { fi: 'Fi column4', sv: 'Sv column4', en: 'En column4' },
              },
            ],
          },
        ],
      },
    },
  ],
};
