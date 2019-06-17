export const LANGUAGE = 'fi';

export const JULKAISUTILA = {
  TALLENNETTU: 'tallennettu',
  JULKAISTU: 'julkaistu',
  ARKISTOITU: 'arkistoitu',
};

export const KOULUTUSTYYPPI = {
  AMMATILLINEN_KOULUTUS: 'amm',
  LUKIOKOULUTUS: 'lk',
  YLIOPISTOKOULUTUS: 'yo',
  AMKKOULUTUS: 'amk',
  VALMA: 'valma',
  TELMA: 'telma',
  TUTKINNON_OSA: 'tutkinnon_osa',
  OSAAMISALA: 'osaamisala',
  AVOIN_YO: 'avoin_yo',
  AVOIN_AMK: 'avoin_amk',
  TAYDENNYS_KOULUTUS: 'taydennyskoulutus',
  ERIKOISTUMISKOULUTUS: 'erikoistumiskoulutus',
  VALMENTAVA_KOULUTUS: 'valmentava_koulutus',
  AMMATILLINEN_OPETTAJAKOULUTUS: 'ammatillinen_opettajakoulutus',
  VAPAA_SIVISTYSTYO: 'vapaa_sivistystyo',
  LUVA: 'luva',
  MUUT_KOULUTUKSET: 'muut_koulutukset',
  PERUSOPETUKSEN_LISAOPETUS: 'perusopetuksen_lisaopetus',
};

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

export const TUTKINTOON_JOHTAMATON_KOULUTUSTYYPPIHIERARKIA = [
  {
    tyyppi: 'ammatillinen',
    children: [
      { tyyppi: KOULUTUSTYYPPI.VALMA },
      { tyyppi: KOULUTUSTYYPPI.TELMA },
      { tyyppi: KOULUTUSTYYPPI.TUTKINNON_OSA },
      { tyyppi: KOULUTUSTYYPPI.OSAAMISALA },
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
    ],
  },
  { tyyppi: KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO },
  { tyyppi: 'yleissivistava', children: [{ tyyppi: KOULUTUSTYYPPI.LUVA }] },
  { tyyppi: KOULUTUSTYYPPI.MUUT_KOULUTUKSET },
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

export const POHJAVALINTA = {
  UUSI: 'uusi',
  KOPIO: 'kopio',
  AIEMPI: 'aiempi',
};

export const OPETUSHALLITUS_ORGANISAATIO_OID = '1.2.246.562.10.00000000001';

export const KOULUTUS_ROLE = 'APP_TARJONTA';

export const TOTEUTUS_ROLE = 'APP_TARJONTA';

export const HAKUKOHDE_ROLE = 'APP_TARJONTA';

export const HAKU_ROLE = 'APP_TARJONTA';

export const VALINTAPERUSTE_ROLE = 'APP_TARJONTA';

export const HAKUTAPA_YHTEISHAKU_KOODI_URI = 'hakutapa_01';

export const LIITTEEN_TOIMITUSTAPA = {
  TOIMITETAAN_LAHETTAMISEN_YHTEYDESSA: 'toimitetaan_lahettamisen_yhteydessa',
  JARJESTAJAN_OSOITE: 'jarjestajan_osoite',
  MUU_OSOITE: 'muu_osoite',
};
