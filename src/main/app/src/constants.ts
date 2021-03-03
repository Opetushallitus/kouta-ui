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

export enum KOULUTUSTYYPPI {
  AMMATILLINEN_KOULUTUS = 'amm',
  LUKIOKOULUTUS = 'lk',
  YLIOPISTOKOULUTUS = 'yo',
  AMKKOULUTUS = 'amk',
  VALMA = 'valma',
  TELMA = 'telma',
  TUTKINNON_OSA = 'amm-tutkinnon-osa',
  OSAAMISALA = 'amm-osaamisala',
  AVOIN_YO = 'avoin_yo',
  AVOIN_AMK = 'avoin_amk',
  TAYDENNYS_KOULUTUS = 'taydennyskoulutus',
  ERIKOISTUMISKOULUTUS = 'erikoistumiskoulutus',
  VALMENTAVA_KOULUTUS = 'valmentava_koulutus',
  AMMATILLINEN_OPETTAJAKOULUTUS = 'ammatillinen_opettajakoulutus',
  AMMATILLINEN_OPINTO_OHJAAJA_KOULUTUS = 'ammatillinen_opinto_ohjaaja_koulutus',
  AMMATILLINEN_ERITYISOPETTAJA_KOULUTUS = 'ammatillinen_erityisopettaja_koulutus',
  VAPAA_SIVISTYSTYO = 'vapaa_sivistystyo',
  LUVA = 'luva',
  MUUT_KOULUTUKSET = 'muut_koulutukset',
  PERUSOPETUKSEN_LISAOPETUS = 'perusopetuksen_lisaopetus',
}

export const KOULUTUSTYYPIT = Object.values(KOULUTUSTYYPPI);

export const TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT = [
  KOULUTUSTYYPPI.AMKKOULUTUS,
  KOULUTUSTYYPPI.YLIOPISTOKOULUTUS,
];

export const TUTKINTOON_JOHTAMATTOMAT_KORKEAKOULU_KOULUTUSTYYPIT = [
  KOULUTUSTYYPPI.AVOIN_YO,
  KOULUTUSTYYPPI.AVOIN_AMK,
  KOULUTUSTYYPPI.TAYDENNYS_KOULUTUS,
  KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS,
  KOULUTUSTYYPPI.VALMENTAVA_KOULUTUS,
  KOULUTUSTYYPPI.AMMATILLINEN_OPETTAJAKOULUTUS,
  KOULUTUSTYYPPI.AMMATILLINEN_OPINTO_OHJAAJA_KOULUTUS,
  KOULUTUSTYYPPI.AMMATILLINEN_ERITYISOPETTAJA_KOULUTUS,
];

export const KORKEAKOULU_KOULUTUSTYYPIT = [
  ...TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
  ...TUTKINTOON_JOHTAMATTOMAT_KORKEAKOULU_KOULUTUSTYYPIT,
];

export const TUTKINTOON_JOHTAVAT_KOULUTUSTYYPIT = [
  KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
  KOULUTUSTYYPPI.LUKIOKOULUTUS,
  ...TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
];

export const TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT = [
  KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
];

export const TUTKINTOON_JOHTAMATTOMAT_AMMATILLISET_KOULUTUSTYYPIT = [
  KOULUTUSTYYPPI.VALMA,
  KOULUTUSTYYPPI.TELMA,
  KOULUTUSTYYPPI.TUTKINNON_OSA,
  KOULUTUSTYYPPI.OSAAMISALA,
  KOULUTUSTYYPPI.MUUT_KOULUTUKSET,
];

export const TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT = _.without(
  KOULUTUSTYYPIT,
  ...TUTKINTOON_JOHTAVAT_KOULUTUSTYYPIT
);

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

export const POHJAVALINTA = {
  UUSI: 'uusi',
  KOPIO: 'kopio',
};

export enum ORGANISAATIOTYYPPI {
  KOULUTUSTOIMIJA = 'organisaatiotyyppi_01',
  OPPILAITOS = 'organisaatiotyyppi_02',
  TOIMIPISTE = 'organisaatiotyyppi_03',
}

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
export const ERROR_KAYTTOOIKEUS_SERVICE = 'ERROR_KAYTTOOIKEUS_SERVICE';

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

export enum ENTITY {
  KOULUTUS = 'koulutus',
  TOTEUTUS = 'toteutus',
  HAKU = 'haku',
  HAKUKOHDE = 'hakukohde',
  VALINTAPERUSTE = 'valintaperuste',
  SORA_KUVAUS = 'soraKuvaus',
  OPPILAITOS = 'oppilaitos',
  OPPILAITOKSEN_OSA = 'oppilaitoksenOsa',
}

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

export enum Hakeutumistapa {
  HAKEUTUMINEN = 'hakeutuminen',
  ILMOITTAUTUMINEN = 'ilmoittautuminen',
}

// react-query options for koodisto, eperuste etc. requests that change rarely
export const LONG_CACHE_QUERY_OPTIONS = {
  staleTime: 30 * 60 * 1000,
  cacheTime: 15 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconned: false,
  retry: 1,
};

export enum Alkamiskausityyppi {
  TARKKA_ALKAMISAJANKOHTA = 'tarkka alkamisajankohta',
  ALKAMISKAUSI_JA_VUOSI = 'alkamiskausi ja -vuosi',
  HENKILOKOHTAINEN_SUUNNITELMA = 'henkilokohtainen suunnitelma',
}

export enum FormMode {
  CREATE = 'create',
  EDIT = 'edit',
}

export const NDASH = '\u2013';

export const AMMATILLISET_OPPILAITOSTYYPIT = [
  'oppilaitostyyppi_21#1', // Ammatilliset oppilaitokset
  'oppilaitostyyppi_22#1', // Ammatilliset erityisoppilaitokset
  'oppilaitostyyppi_23#1', // Ammatilliset erikoisoppilaitokset
  'oppilaitostyyppi_24#1', // Ammatilliset aikuiskoulutuskeskukset
  'oppilaitostyyppi_28#1', // Palo-, poliisi- ja vartiointialojen oppilaitokset
  'oppilaitostyyppi_29#1', // Sotilasalan ammatilliset oppilaitokset
];

export const KORKEAKOULU_OPPILAITOSTYYPIT = [
  'oppilaitostyyppi_41#1', // Ammattikorkeakoulut
  'oppilaitostyyppi_42#1', // Yliopistot
  'oppilaitostyyppi_43#1', // Sotilaskorkeakoulut
  'oppilaitostyyppi_45#1', // Lastentarhanopettajaopistot
];

export const LUKIO_OPPILAITOSTYYPIT = [
  'oppilaitostyyppi_15#1', // Lukiot
  'oppilaitostyyppi_19#1', // Perus- ja lukioasteen koulut
];

export enum ApurahaTyyppi {
  EI_KAYTOSSA = 'ei käytössä',
  APURAHA = 'apuraha',
}

export enum ApurahaMaaraTyyppi {
  YKSI_ARVO = 'single',
  VAIHTELUVALI = 'range',
}

export enum ApurahaYksikko {
  EURO = 'euroa',
  PROSENTTI = 'prosenttia',
}
