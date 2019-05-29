export const LANGUAGE = 'fi';

export const JULKAISUTILA = {
  TALLENNETTU: 'tallennettu',
  JULKAISTU: 'julkaistu',
  ARKISTOITU: 'arkistoitu',
};

export const KOULUTUSTYYPPI = {
  AMMATILLINEN_KOULUTUS: 'amm',
  KORKEAKOULUKOULUTUS: 'kk',
  LUKIOKOULUTUS: 'lk',
  MUU_KOULUTUS: 'muu',
  YLIOPISTOKOULUTUS: 'yo',
  AMKKOULUTUS: 'amk',
};

export const KOULUTUSTYYPPI_TO_KOULUTUSTYYPPI_IDS_MAP = {
  [KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS]: [
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
  [KOULUTUSTYYPPI.KORKEAKOULUKOULUTUS]: ['koulutustyyppi_3'],
  [KOULUTUSTYYPPI.LUKIOKOULUTUS]: [
    'koulutustyyppi_2',
    'koulutustyyppi_9',
    'koulutustyyppi_14',
    'koulutustyyppi_23',
  ],
  [KOULUTUSTYYPPI.MUU_KOULUTUS]: [
    'koulutustyyppi_6',
    'koulutustyyppi_10',
    'koulutustyyppi_15',
    'koulutustyyppi_16',
    'koulutustyyppi_24',
    'koulutustyyppi_21',
    'koulutustyyppi_22',
  ],
  [KOULUTUSTYYPPI.YLIOPISTOKOULUTUS]: ['koulutustyyppi_3'],
  [KOULUTUSTYYPPI.AMKKOULUTUS]: ['koulutustyyppi_3'],
};

export const HAKULOMAKETYYPPI = {
  ATARU: 'ataru',
  HAKUAPP: 'haku-app',
  MUU: 'muu',
  EI_SAHKOISTA_HAKUA: 'ei sähköistä',
};

export const VALINTAPERUSTEET_KIELITAITO_MUU_OSOITUS_KOODI_URI =
  'kielitaidonosoittaminen_04';

export const KORKEAKOULUKOULUTUSTYYPIT = [
  KOULUTUSTYYPPI.YLIOPISTOKOULUTUS,
  KOULUTUSTYYPPI.AMKKOULUTUS,
  KOULUTUSTYYPPI.KORKEAKOULUKOULUTUS,
];

export const POHJAVALINTA = {
  UUSI: 'uusi',
  KOPIO: 'kopio',
  AIEMPI: 'aiempi',
};

export const OPETUSHALLITUS_ORGANISAATIO_OID = '1.2.246.562.10.00000000001';

export const KOUTA_CRUD_ROLE = 'APP_TARJONTA_CRUD';

export const HAKUTAPA_YHTEISHAKU_KOODI_URI = 'hakutapa_01';

export const LIITTEEN_TOIMITUSTAPA = {
  TOIMITETAAN_LAHETTAMISEN_YHTEYDESSA: 'toimitetaan_lahettamisen_yhteydessa',
  JARJESTAJAN_OSOITE: 'jarjestajan_osoite',
  MUU_OSOITE: 'muu_osoite',
};
