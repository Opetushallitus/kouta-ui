import _ from 'lodash';

export const LANGUAGES = ['fi', 'sv', 'en'];

export enum JULKAISUTILA {
  TALLENNETTU = 'tallennettu',
  JULKAISTU = 'julkaistu',
  ARKISTOITU = 'arkistoitu',
}

export function getJulkaisutilaTranslationKey(tila: JULKAISUTILA): string {
  if (tila === JULKAISUTILA.TALLENNETTU) return 'julkaisutilat.tallennettu';
  if (tila === JULKAISUTILA.ARKISTOITU) return 'julkaisutilat.arkistoitu';
  if (tila === JULKAISUTILA.JULKAISTU) return 'julkaisutilat.julkaistu';
  throw new Error(`Unknown julkaisutila given: ${tila}`);
}

export const DEFAULT_JULKAISUTILA = JULKAISUTILA.TALLENNETTU;

export const KOULUTUSTYYPPI = {
  AMMATILLINEN_KOULUTUS: 'amm',
  LUKIOKOULUTUS: 'lk',
  YLIOPISTOKOULUTUS: 'yo',
  AMKKOULUTUS: 'amk',
  VALMA: 'valma',
  TELMA: 'telma',
  TUTKINNON_OSA: 'amm-tutkinnon-osa',
  OSAAMISALA: 'amm-osaamisala',
  AVOIN_YO: 'avoin_yo',
  AVOIN_AMK: 'avoin_amk',
  TAYDENNYS_KOULUTUS: 'taydennyskoulutus',
  ERIKOISTUMISKOULUTUS: 'erikoistumiskoulutus',
  VALMENTAVA_KOULUTUS: 'valmentava_koulutus',
  AMMATILLINEN_OPETTAJAKOULUTUS: 'ammatillinen_opettajakoulutus',
  AMMATILLINEN_OPINTO_OHJAAJA_KOULUTUS: 'ammatillinen_opinto_ohjaaja_koulutus',
  AMMATILLINEN_ERITYISOPETTAJA_KOULUTUS:
    'ammatillinen_erityisopettaja_koulutus',
  VAPAA_SIVISTYSTYO: 'vapaa_sivistystyo',
  LUVA: 'luva',
  MUUT_KOULUTUKSET: 'muut_koulutukset',
  PERUSOPETUKSEN_LISAOPETUS: 'perusopetuksen_lisaopetus',
} as const;

export const KOULUTUSTYYPIT = Object.values(KOULUTUSTYYPPI);

export const TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT = [
  KOULUTUSTYYPPI.AMKKOULUTUS,
  KOULUTUSTYYPPI.YLIOPISTOKOULUTUS,
];

export const TUTKINTOON_JOHTAVAT_KOULUTUSTYYPIT = [
  KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
  KOULUTUSTYYPPI.LUKIOKOULUTUS,
  ...TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
];

export const TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT = [
  KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
];

export const TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT = _.without(
  KOULUTUSTYYPIT,
  ...TUTKINTOON_JOHTAVAT_KOULUTUSTYYPIT
);

export const TUTKINTOON_JOHTAMATON_KOULUTUSTYYPPIHIERARKIA = [
  {
    tyyppi: 'ammatillinen',
    children: [
      { tyyppi: KOULUTUSTYYPPI.VALMA },
      { tyyppi: KOULUTUSTYYPPI.TELMA },
      { tyyppi: KOULUTUSTYYPPI.TUTKINNON_OSA },
      { tyyppi: KOULUTUSTYYPPI.OSAAMISALA },
      { tyyppi: KOULUTUSTYYPPI.MUUT_KOULUTUKSET },
    ],
  },
  {
    tyyppi: 'korkeakoulutus',
    children: [
      { tyyppi: KOULUTUSTYYPPI.AVOIN_YO },
      { tyyppi: KOULUTUSTYYPPI.AVOIN_AMK },
      { tyyppi: KOULUTUSTYYPPI.TAYDENNYS_KOULUTUS },
      { tyyppi: KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS },
      { tyyppi: KOULUTUSTYYPPI.VALMENTAVA_KOULUTUS },
      { tyyppi: KOULUTUSTYYPPI.AMMATILLINEN_OPETTAJAKOULUTUS },
      { tyyppi: KOULUTUSTYYPPI.AMMATILLINEN_OPINTO_OHJAAJA_KOULUTUS },
      { tyyppi: KOULUTUSTYYPPI.AMMATILLINEN_ERITYISOPETTAJA_KOULUTUS },
    ],
  },
  { tyyppi: KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO },
  { tyyppi: KOULUTUSTYYPPI.LUVA },
  { tyyppi: KOULUTUSTYYPPI.PERUSOPETUKSEN_LISAOPETUS },
];

export const TUTKINTOON_JOHTAVA_KOULUTUSTYYPPIHIERARKIA = [
  { tyyppi: KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS },
  {
    tyyppi: 'korkeakoulutus',
    children: [
      { tyyppi: KOULUTUSTYYPPI.YLIOPISTOKOULUTUS },
      { tyyppi: KOULUTUSTYYPPI.AMKKOULUTUS },
    ],
  },
  { tyyppi: KOULUTUSTYYPPI.LUKIOKOULUTUS },
];

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
  [KOULUTUSTYYPPI.LUKIOKOULUTUS]: [
    'koulutustyyppi_2',
    'koulutustyyppi_9',
    'koulutustyyppi_14',
    'koulutustyyppi_23',
  ],
  [KOULUTUSTYYPPI.MUUT_KOULUTUKSET]: [
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

export enum HAKULOMAKETYYPPI {
  ATARU = 'ataru',
  HAKUAPP = 'haku-app',
  MUU = 'muu',
  EI_SAHKOISTA_HAKUA = 'ei sähköistä',
}

export const VALINTAPERUSTEET_KIELITAITO_MUU_OSOITUS_KOODI_URI =
  'kielitaidonosoittaminen_04';

export const POHJAVALINTA = {
  UUSI: 'uusi',
  KOPIO: 'kopio',
  AIEMPI: 'aiempi',
};

export const ORGANISAATIOTYYPPI = {
  KOULUTUSTOIMIJA: 'organisaatiotyyppi_01',
  OPPILAITOS: 'organisaatiotyyppi_02',
  TOIMIPISTE: 'organisaatiotyyppi_03',
};

export const OPETUSHALLITUS_ORGANISAATIO_OID = '1.2.246.562.10.00000000001';

export const KOULUTUS_ROLE = 'APP_KOUTA_KOULUTUS';

export const TOTEUTUS_ROLE = 'APP_KOUTA_TOTEUTUS';

export const HAKUKOHDE_ROLE = 'APP_KOUTA_HAKUKOHDE';

export const HAKU_ROLE = 'APP_KOUTA_HAKU';

export const VALINTAPERUSTE_ROLE = 'APP_KOUTA_VALINTAPERUSTE';

export const OPH_PAAKAYTTAJA_ROLE = 'APP_KOUTA_OPHPAAKAYTTAJA';

export const OPPILAITOS_ROLE = 'APP_KOUTA_OPPILAITOS';

export const HAKUTAPA_YHTEISHAKU_KOODI_URI = 'hakutapa_01';

export const LIITTEEN_TOIMITUSTAPA = {
  TOIMITETAAN_LAHETTAMISEN_YHTEYDESSA: 'lomake',
  JARJESTAJAN_OSOITE: 'hakijapalvelu',
  MUU_OSOITE: 'osoite',
};

export const IDLE_TIMEOUT = 30e3; // 30 seconds
export const ERROR_INTERNET_DISCONNECTED = 'ERROR_INTERNET_DISCONNECTED';

export const TEEMAKUVA_ACCEPTED_FORMATS = ['.jpg', '.jpeg', '.png'];
export const TEEMAKUVA_MAX_SIZE = 2000000;
export const TEEMAKUVA_MIN_DIMENSIONS = { width: 1260, height: 400 };

export const LOGO_ACCEPTED_FORMATS = ['.jpg', '.jpeg', '.png', '.svg'];
export const LOGO_MAX_DIMENSIONS = { width: 150, height: 120 };
export const LOGO_MAX_SIZE = 100000;
export const LOGO_NO_DIMENSION_CHECK_FOR_FORMATS = ['.svg'];

export const EPERUSTE_STATUS_TULEVA = 'tuleva';
export const EPERUSTE_STATUS_VOIMASSA = 'voimassa';

export const ALLOWED_HTML_TAGS = [
  'b',
  'blockquote',
  'br',
  'code',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'i',
  'li',
  'ol',
  'p',
  'pre',
  's',
  'sup',
  'sub',
  'strong',
  'strike',
  'ul',
];

export const ENTITY = {
  KOULUTUS: 'koulutus',
  TOTEUTUS: 'toteutus',
  HAKU: 'haku',
  HAKUKOHDE: 'hakukohde',
  VALINTAPERUSTE: 'valintaperuste',
  SORA_KUVAUS: 'soraKuvaus',
  OPPILAITOS: 'oppilaitos',
  OPPILAITOKSEN_OSA: 'oppilaitoksenOsa',
};

export const ICONS = {
  koulutus: 'school',
  toteutus: 'flag',
  haku: 'access_time',
  hakukohde: 'list_alt',
  valintaperuste: 'filter_list',
  soraKuvaus: 'subject',
  oppilaitos: 'account_balance',
  oppilaitoksenOsa: 'home_work',
};

export const ENTITY_ROLES = {
  koulutus: KOULUTUS_ROLE,
  toteutus: TOTEUTUS_ROLE,
  haku: HAKU_ROLE,
  hakukohde: HAKUKOHDE_ROLE,
  valintaperuste: VALINTAPERUSTE_ROLE,
  oppilaitos: OPPILAITOS_ROLE,
};

export const CRUD_ROLES = {
  READ: 'read',
  UPDATE: 'update',
  CREATE: 'create',
};

export const HAKEUTUMINEN = 'hakeutuminen';
export const ILMOITTAUTUMINEN = 'ilmoittautuminen';

export const EPERUSTE_SERVICE_QUERY_OPTIONS = {
  cacheTime: Infinity,
};

export enum ALKAMISKAUSITYYPPI {
  TARKKA_ALKAMISAJANKOHTA = 'tarkka alkamisajankohta',
  ALKAMISKAUSI_JA_VUOSI = 'alkamiskausi ja -vuosi',
  HENKILOKOHTAINEN_SUUNNITELMA = 'henkilokohtainen suunnitelma',
}

export enum TOTEUTUKSEN_AJANKOHTA {
  ALKAMISKAUSI = 'alkamiskausi',
  HENKILOKOHTAINEN_SUUNNITELMA = 'aloitusHenkilokohtaisenSuunnitelmanMukaisesti',
}
