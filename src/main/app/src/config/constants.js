export const ENV_MOCK = 'ENV_MOCK';
export const ENV_DEV = 'ENV_DEV';
export const LANGUAGE = 'FI';

export const SERVICE_DOMAINS =  {
  [ENV_DEV]: "https://virkailija.hahtuvaopintopolku.fi",
  [ENV_MOCK]: "http://localhost:3001"
};

export const JULKAISUTILA = {
  TALLENNETTU: 'tallennettu',
  JULKAISTU: 'julkaistu'
};

export const REQUEST_STATUS = {
  SUCCESS: 'success',
  FAILURE: 'failure',
  DISABLED: 'disabled',
  ENABLED: 'enabled'
};

export const KOULUTUSTYYPPI_CATEGORY = {
  AMMATILLINEN_KOULUTUS: 'amm',
  KORKEAKOULUKOULUTUS: 'kk',
  LUKIOKOULUTUS: 'lk',
  MUU_KOULUTUS: 'muu'
};

export const ENTITY_MODIFICATION_MODE = {
  CREATE_ENTITY: 'CREATE_ENTITY',
  INHERIT_ENTITY: 'INHERIT_ENTITY',
  USE_ENTITY: 'USE_ENTITY'
}

export const WORKFLOW = {
  KOULUTUS: 'WORKFLOW_KOULUTUS',
  TOTEUTUS: 'WORKFLOW_TOTEUTUS',
  HAKU: 'WORKFLOW_HAKU',
  HAKUKOHDE: 'WORKFLOW_HAKUKOHDE',
  VALINTAPERUSTEET: 'WORKFLOW_VALINTAPERUSTEET'
}

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
    'koulutustyyppi_26'
  ],
  [KOULUTUSTYYPPI_CATEGORY.KORKEAKOULUKOULUTUS]: [
    'koulutustyyppi_3'
  ],
  [KOULUTUSTYYPPI_CATEGORY.LUKIOKOULUTUS]: [
    'koulutustyyppi_2',
    'koulutustyyppi_9',
    'koulutustyyppi_14',
    'koulutustyyppi_23'
  ],
  [KOULUTUSTYYPPI_CATEGORY.MUU_KOULUTUS]: [
    'koulutustyyppi_6',
    'koulutustyyppi_10',
    'koulutustyyppi_15',
    'koulutustyyppi_16',
    'koulutustyyppi_24',
    'koulutustyyppi_21',
    'koulutustyyppi_22'
  ]
};

export const LANGUAGE_CODE_TO_LANGUAGE_NAME = {
  'fi': 'Suomi',
  'sv': 'Ruotsi',
  'en': 'Englanti'
}

export const LANGUAGE_CODE_TO_TAB_NAME = {
  'fi': 'Suomeksi',
  'sv': 'Ruotsiksi',
  'en': 'Englanniksi'
};
