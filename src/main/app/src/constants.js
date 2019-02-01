export const LANGUAGE = 'fi';

export const JULKAISUTILA = {
  TALLENNETTU: 'tallennettu',
  JULKAISTU: 'julkaistu',
};

export const KOULUTUSTYYPPI_CATEGORY = {
  AMMATILLINEN_KOULUTUS: 'amm',
  KORKEAKOULUKOULUTUS: 'kk',
  LUKIOKOULUTUS: 'lk',
  MUU_KOULUTUS: 'muu',
};

export const KOULUTUSTYYPPI_CATEGORY_TO_KOULUTUSTYYPPI_IDS_MAP = {
  [KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS]: [
    'koulutustyyppi_1',
    'koulutustyyppi_4',
    'koulutustyyppi_5',
    'koulutustyyppi_7',
    'koulutustyyppi_8',
    'koulutustyyppi_11',
    'koulutustyyppi_12',
    'koulutustyyppi_13',
    'koulutustyyppi_18',
    'koulutustyyppi_19',
    'koulutustyyppi_26',
  ],
  [KOULUTUSTYYPPI_CATEGORY.KORKEAKOULUKOULUTUS]: ['koulutustyyppi_3'],
  [KOULUTUSTYYPPI_CATEGORY.LUKIOKOULUTUS]: [
    'koulutustyyppi_2',
    'koulutustyyppi_9',
    'koulutustyyppi_14',
    'koulutustyyppi_23',
  ],
  [KOULUTUSTYYPPI_CATEGORY.MUU_KOULUTUS]: [
    'koulutustyyppi_6',
    'koulutustyyppi_10',
    'koulutustyyppi_15',
    'koulutustyyppi_16',
    'koulutustyyppi_24',
    'koulutustyyppi_21',
    'koulutustyyppi_22',
  ],
};

export const LANGUAGE_CODE_TO_LANGUAGE_NAME = {
  fi: 'Suomi',
  sv: 'Ruotsi',
  en: 'Englanti',
};

export const LANGUAGE_CODE_TO_TAB_NAME = {
  fi: 'Suomeksi',
  sv: 'Ruotsiksi',
  en: 'Englanniksi',
};

export const LANGUAGE_TABS = [
  { label: LANGUAGE_CODE_TO_TAB_NAME.fi, value: 'fi' },
  { label: LANGUAGE_CODE_TO_TAB_NAME.sv, value: 'sv' },
  { label: LANGUAGE_CODE_TO_TAB_NAME.en, value: 'en' },
];

export const TOTEUTUKSEN_OSIOT_OPTIONS = [
  { value: 'opintojen_rakenne', label: 'Opintojen rakenne' },
  { value: 'jatko_opintomahdollisuudet', label: 'Jatko-opintomahdollisuudet' },
  { value: 'osaamisalan_valinta', label: 'Osaamisalan valinta' },
  { value: 'sisalto', label: 'Sisältö' },
  { value: 'uramahdollisuudet', label: 'Uramahdollisuudet' },
  { value: 'kohderyhma', label: 'Kohderyhmä' },
  { value: 'kansainvalistyminen', label: 'Kansainvälistyminen' },
  { value: 'yhteistyo', label: 'Yhteistyö muiden toimijoiden kanssa' },
];

export const HAKUKOHDE_LOMAKETYYPPI_OPTIONS = [
  { value: 'ataru', label: 'Käytetään hakemuspalvelun lomaketta' },
  { value: 'haku-app', label: 'Käytetään järjestelmän hakulomaketta' },
  { value: 'muu', label: 'Käytetään muuta hakulomaketta' },
  { value: 'ei_hakua', label: 'Ei sähköistä hakua' },
];

export const VALINTAPERUSTEET_KIELITAITO_OPTIONS = [
  { value: 'yleinen_kielitutkinto', label: 'Yleinen kielitutkinto' },
  { value: 'toefl', label: 'TOELF' },
  { value: 'ielts', label: 'IELTS (Academic IELTS only)' },
  { value: 'cae_cpe', label: 'CAE/CPE' },
];

export const VALINTAPERUSTEET_KIELITAITO_OSOITUS_OPTIONS = [
  {
    value: 'kk_tutkinto_suomessa',
    label: 'kk-tutkinto Suomessa (suomeksi, ruotsiksi tai englanniksi)',
  },
  {
    value: 'kk_tutkinto_eu_eta',
    label: 'kk-tutkinto englanniksi EU/ETA-maassa',
  },
  {
    value: 'kk_tunkinto_muualla',
    label:
      'kk-tutkinto englanniksi paikan päällä suoritettuna joissain seuraavista maista: USA, Kanada, Australia, Irlanti, Uusi-Seelanti',
  },
];
