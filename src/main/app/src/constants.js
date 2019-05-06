export const LANGUAGE = 'fi';

export const JULKAISUTILA = {
  TALLENNETTU: 'tallennettu',
  JULKAISTU: 'julkaistu',
  ARKISTOITU: 'arkistoitu',
};

export const KOULUTUSTYYPPI_CATEGORY = {
  AMMATILLINEN_KOULUTUS: 'amm',
  KORKEAKOULUKOULUTUS: 'kk',
  LUKIOKOULUTUS: 'lk',
  MUU_KOULUTUS: 'muu',
  YLIOPISTOKOULUTUS: 'yo',
  AMKKOULUTUS: 'amk',
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
  [KOULUTUSTYYPPI_CATEGORY.YLIOPISTOKOULUTUS]: ['koulutustyyppi_3'],
  [KOULUTUSTYYPPI_CATEGORY.AMKKOULUTUS]: ['koulutustyyppi_3'],
};

export const HAKUKOHDE_LOMAKETYYPPI_OPTIONS = [
  { value: 'ataru', label: 'Käytetään hakemuspalvelun lomaketta' },
  { value: 'haku-app', label: 'Käytetään järjestelmän hakulomaketta' },
  { value: 'muu', label: 'Käytetään muuta hakulomaketta' },
  { value: 'ei_hakua', label: 'Ei sähköistä hakua' },
];

export const HAKU_LOMAKETYYPPI_OPTIONS = [
  { value: 'ataru', label: 'Käytetään hakemuspalvelun lomaketta' },
  { value: 'haku-app', label: 'Käytetään järjestelmän hakulomaketta' },
  { value: 'muu', label: 'Käytetään muuta hakulomaketta' },
  { value: 'ei sähköistä', label: 'Ei sähköistä hakua' },
];

export const HAKULOMAKE_TYYPIT = {
  ATARU: 'ataru',
  HAKUAPP: 'hakuapp',
  MUU: 'muu',
  EI_SAHKOISTA_HAKUA: 'ei_sahkoista_hakua',
};

export const VALINTAPERUSTEET_KIELITAITO_MUU_OSOITUS_KOODI_URI =
  'kielitaidonosoittaminen_04';

export const KORKEAKOULUKOULUTUSTYYPIT = [
  KOULUTUSTYYPPI_CATEGORY.YLIOPISTOKOULUTUS,
  KOULUTUSTYYPPI_CATEGORY.AMKKOULUTUS,
  KOULUTUSTYYPPI_CATEGORY.KORKEAKOULUKOULUTUS,
];

export const POHJAVALINNAT = {
  UUSI: 'uusi',
  KOPIO: 'kopio',
  AIEMPI: 'aiempi',
};
