import _ from 'lodash';

export const LANGUAGES = ['fi', 'sv', 'en'];

export enum JULKAISUTILA {
  TALLENNETTU = 'tallennettu',
  JULKAISTU = 'julkaistu',
  ARKISTOITU = 'arkistoitu',
  POISTETTU = 'poistettu',
}

export function getJulkaisutilaTranslationKey(tila: JULKAISUTILA): string {
  if (tila === JULKAISUTILA.TALLENNETTU) return 'julkaisutilat.tallennettu';
  if (tila === JULKAISUTILA.ARKISTOITU) return 'julkaisutilat.arkistoitu';
  if (tila === JULKAISUTILA.JULKAISTU) return 'julkaisutilat.julkaistu';
  if (tila === JULKAISUTILA.POISTETTU) return 'julkaisutilat.poistettu';
  throw new Error(`Unknown julkaisutila given: ${tila}`);
}

export const DEFAULT_JULKAISUTILA = JULKAISUTILA.TALLENNETTU;

export enum NAKYVYYS {
  JULKINEN = 'julkinen',
  EI_JULKINEN = 'ei_julkinen',
}

export enum KOULUTUSTYYPPI {
  AMMATILLINEN_KOULUTUS = 'amm',
  LUKIOKOULUTUS = 'lk',
  YLIOPISTOKOULUTUS = 'yo',
  AMKKOULUTUS = 'amk',
  TELMA = 'telma',
  TUTKINNON_OSA = 'amm-tutkinnon-osa',
  OSAAMISALA = 'amm-osaamisala',
  MUU_AMMATILLINEN_KOULUTUS = 'amm-muu',
  AVOIN_YO = 'avoin_yo',
  AVOIN_AMK = 'avoin_amk',
  TAYDENNYSKOULUTUS = 'taydennyskoulutus',
  ERIKOISTUMISKOULUTUS = 'erikoistumiskoulutus',
  VALMENTAVA_KOULUTUS = 'valmentava_koulutus',
  AMMATILLINEN_OPETTAJA_ERITYISOPETTAJA_JA_OPOKOULUTUS = 'amm-ope-erityisope-ja-opo',
  OPETTAJIEN_PEDAGOGISET_OPINNOT = 'ope-pedag-opinnot',
  TUVA = 'tuva',
  VAPAA_SIVISTYSTYO_OPISTOVUOSI = 'vapaa-sivistystyo-opistovuosi',
  VAPAA_SIVISTYSTYO_MUU = 'vapaa-sivistystyo-muu',
  AIKUISTEN_PERUSOPETUS = 'aikuisten-perusopetus',
  KORKEAKOULUTUS_OPINTOJAKSO = 'kk-opintojakso',
  ERIKOISLAAKARI = 'erikoislaakari',
  KORKEAKOULUTUS_OPINTOKOKONAISUUS = 'kk-opintokokonaisuus',
}

export const KOULUTUSTYYPIT = Object.values(KOULUTUSTYYPPI);

export const TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT = [
  KOULUTUSTYYPPI.AMKKOULUTUS,
  KOULUTUSTYYPPI.YLIOPISTOKOULUTUS,
];

export const TUTKINTOON_JOHTAMATTOMAT_KORKEAKOULU_KOULUTUSTYYPIT = [
  // NOTE: Näitä korkeakoulukoulutustyyppejä ei ole vielä lisätty
  // KOULUTUSTYYPPI.AVOIN_YO,
  // KOULUTUSTYYPPI.AVOIN_AMK,
  // KOULUTUSTYYPPI.TAYDENNYSKOULUTUS,
  // KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS,
  // KOULUTUSTYYPPI.VALMENTAVA_KOULUTUS,
  KOULUTUSTYYPPI.AMMATILLINEN_OPETTAJA_ERITYISOPETTAJA_JA_OPOKOULUTUS,
  KOULUTUSTYYPPI.OPETTAJIEN_PEDAGOGISET_OPINNOT,
  KOULUTUSTYYPPI.ERIKOISLAAKARI,
  KOULUTUSTYYPPI.KORKEAKOULUTUS_OPINTOJAKSO,
  KOULUTUSTYYPPI.KORKEAKOULUTUS_OPINTOKOKONAISUUS,
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
  KOULUTUSTYYPPI.TELMA,
  KOULUTUSTYYPPI.TUTKINNON_OSA,
  KOULUTUSTYYPPI.OSAAMISALA,
  KOULUTUSTYYPPI.MUU_AMMATILLINEN_KOULUTUS,
];

export const TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT = _.without(
  KOULUTUSTYYPIT,
  ...TUTKINTOON_JOHTAVAT_KOULUTUSTYYPIT
);

// NOTE: Näitä koulutustyyppejä ei tueta koska niiden toteutus puuttuu backendista, päivitä listaa kun backend tukee näitä
export const EI_TUETUT_KOULUTUSTYYPIT = [
  KOULUTUSTYYPPI.AVOIN_YO,
  KOULUTUSTYYPPI.AVOIN_AMK,
  KOULUTUSTYYPPI.TAYDENNYSKOULUTUS,
  KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS,
  KOULUTUSTYYPPI.VALMENTAVA_KOULUTUS,
];

export const TOINEN_ASTE_YHTEISHAKU_KOULUTUSTYYPIT = [
  KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
  KOULUTUSTYYPPI.LUKIOKOULUTUS,
  KOULUTUSTYYPPI.TUVA,
  KOULUTUSTYYPPI.TELMA,
  KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OPISTOVUOSI,
];

export const TUTKINTOON_JOHTAVA_KOULUTUSTYYPPIHIERARKIA = [
  { value: KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS },
  {
    value: 'korkeakoulutus',
    children: TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT.map(kt => ({
      value: kt,
    })),
  },
  { value: KOULUTUSTYYPPI.LUKIOKOULUTUS },
];

export const TUTKINTOON_JOHTAMATON_KOULUTUSTYYPPIHIERARKIA = [
  {
    value: 'ammatillinen',
    children: TUTKINTOON_JOHTAMATTOMAT_AMMATILLISET_KOULUTUSTYYPIT.map(kt => ({
      value: kt,
    })),
  },
  {
    value: 'korkeakoulutus',
    children: TUTKINTOON_JOHTAMATTOMAT_KORKEAKOULU_KOULUTUSTYYPIT.map(kt => ({
      value: kt,
    })),
  },
  {
    value: 'vapaa-sivistystyo',
    children: [
      {
        value: KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OPISTOVUOSI,
      },
      { value: KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_MUU },
    ],
  },
  { value: KOULUTUSTYYPPI.TUVA },
  { value: KOULUTUSTYYPPI.AIKUISTEN_PERUSOPETUS },
];

export const OPETTAJA_KOULUTUSTYYPIT = [
  KOULUTUSTYYPPI.AMMATILLINEN_OPETTAJA_ERITYISOPETTAJA_JA_OPOKOULUTUS,
  KOULUTUSTYYPPI.OPETTAJIEN_PEDAGOGISET_OPINNOT,
];

const AMM_KOULUTUS_KOODIURIT = [
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
];

export const KOULUTUSTYYPPI_TO_YLAKOODIURI_MAP = {
  [KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS]: AMM_KOULUTUS_KOODIURIT,
  [KOULUTUSTYYPPI.OSAAMISALA]: AMM_KOULUTUS_KOODIURIT,
  [KOULUTUSTYYPPI.TUTKINNON_OSA]: AMM_KOULUTUS_KOODIURIT,
  [KOULUTUSTYYPPI.YLIOPISTOKOULUTUS]: [
    'tutkintotyyppi_13',
    'tutkintotyyppi_14',
    'tutkintotyyppi_15',
    'eqf_8',
  ],
  [KOULUTUSTYYPPI.AMKKOULUTUS]: [
    'tutkintotyyppi_06',
    'tutkintotyyppi_07',
    'tutkintotyyppi_12',
  ],
  [KOULUTUSTYYPPI.AVOIN_AMK]: [
    'tutkintotyyppi_06',
    'tutkintotyyppi_07',
    'tutkintotyyppi_12',
  ],
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
  VARHAISKASVATUKSEN_JARJESTAJA = 'organisaatiotyyppi_07',
  VARHAISKASVATUKSEN_TOIMIPAIKKA = 'organisaatiotyyppi_08',
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
export const ERROR_REACT_CRASH = 'ERROR_REACT_CRASH';

export const TEEMAKUVA_ACCEPTED_FORMATS = ['.jpg', '.jpeg', '.png'];
export const TEEMAKUVA_MAX_SIZE = 2 * 1000 * 1000;
export const TEEMAKUVA_MIN_DIMENSIONS = { width: 1260, height: 400 };

export const LOGO_ACCEPTED_FORMATS = ['.jpg', '.jpeg', '.png', '.svg'];
export const LOGO_MAX_SIZE = 100 * 1000;
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
  refetchOnReconnect: false,
  retry: 1,
};

export const PREVENT_REFETCH_QUERY_OPTIONS = {
  staleTime: Infinity,
  cacheTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
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

export const ONLY_OPH_CAN_SAVE_KOULUTUS_KOULUTUSTYYPIT = [
  KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
  KOULUTUSTYYPPI.LUKIOKOULUTUS,
  KOULUTUSTYYPPI.TELMA,
  KOULUTUSTYYPPI.TUVA,
  KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OPISTOVUOSI,
  KOULUTUSTYYPPI.AIKUISTEN_PERUSOPETUS,
];

export const AMMATILLISET_OPPILAITOSTYYPIT = [
  'oppilaitostyyppi_21', // Ammatilliset oppilaitokset
  'oppilaitostyyppi_22', // Ammatilliset erityisoppilaitokset
  'oppilaitostyyppi_23', // Ammatilliset erikoisoppilaitokset
  'oppilaitostyyppi_24', // Ammatilliset aikuiskoulutuskeskukset
  'oppilaitostyyppi_28', // Palo-, poliisi- ja vartiointialojen oppilaitokset
  'oppilaitostyyppi_29', // Sotilasalan ammatilliset oppilaitokset
];

export const KORKEAKOULU_OPPILAITOSTYYPIT = [
  'oppilaitostyyppi_41', // Ammattikorkeakoulut
  'oppilaitostyyppi_42', // Yliopistot
  'oppilaitostyyppi_43', // Sotilaskorkeakoulut
  'oppilaitostyyppi_45', // Lastentarhanopettajaopistot
];

export const LUKIO_OPPILAITOSTYYPIT = [
  'oppilaitostyyppi_15#1', // Lukiot
  'oppilaitostyyppi_19#1', // Perus- ja lukioasteen koulut
];

export enum MaaraTyyppi {
  YKSI_ARVO = 'single',
  VAIHTELUVALI = 'range',
}

export enum ApurahaYksikko {
  EURO = 'euro',
  PROSENTTI = 'prosentti',
}

export const FIELD_ERROR_CLASSNAME = 'field-error';

export const EB_KOULUTUSKOODIURI = 'koulutus_301104';
export const DIA_KOULUTUSKOODIURI = 'koulutus_301103';
export const LUKIO_KOULUTUSKOODIURIT = [
  'koulutus_309902', // Lukion oppimäärä
  'koulutus_301102', // IB-tutkinto
  'koulutus_301101', // Ylioppilastutkinto
  EB_KOULUTUSKOODIURI, // European Baccalaureate
  DIA_KOULUTUSKOODIURI, // DIA-tutkinto (Deutsche Internationale Abitur)
];

export const AMM_OPETTAJA_ERIKOISOPETTAJA_OPO_KOULUTUSKOODIURIT = [
  'koulutus_000001', // Ammatillinen opettajankoulutus
  'koulutus_000002', // Ammatillinen erityisopettajan koulutus
  'koulutus_000003', // Ammatillinen opinto-ohjaajan koulutus
];

export const ERIKOISLAAKARI_KOULUTUSKOODIURIT = [
  'koulutus_775101', // Erikoislääkäri
  'koulutus_775201', // Erikoishammaslääkäri
  'koulutus_775301', // Erikoiseläinlääkäri
];

export enum KoulutusalaKoodi {
  YLEISSIVISTAVA = 'kansallinenkoulutusluokitus2016koulutusalataso1_00',
  KASVATUSALAT = 'kansallinenkoulutusluokitus2016koulutusalataso1_01',
  TERVEYS = 'kansallinenkoulutusluokitus2016koulutusalataso2_091',
}

export const LUKIO_YLEISLINJA = 'yleislinja';

export const KOULUTUS_PERUSOPETUS_KOODIURI = 'koulutus_201101';

export const YO_OPETTAJA_KOULUTUS_KOODIURI = 'koulutus_919999';

export type Koulutustyyppi = ValueOf<KOULUTUSTYYPPI>;

export enum OpintojenLaajuusyksikko {
  OPINTOPISTE = 'opintojenlaajuusyksikko_2',
  OSAAMISPISTE = 'opintojenlaajuusyksikko_6',
}

export const PAINOTETUT_OPPIAINEET_LUKIO_KAIKKI_OPTIONS = [
  { value: 'painotettavatoppiaineetlukiossa_a1', label: 'A1 (Kaikki)' },
  { value: 'painotettavatoppiaineetlukiossa_a2', label: 'A2 (Kaikki)' },
  { value: 'painotettavatoppiaineetlukiossa_b1', label: 'B1 (Kaikki)' },
  { value: 'painotettavatoppiaineetlukiossa_b2', label: 'B2 (Kaikki)' },
  { value: 'painotettavatoppiaineetlukiossa_b3', label: 'B3 (Kaikki)' },
];
