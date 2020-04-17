import { get } from 'lodash';

import {
  KOULUTUSTYYPPI,
  KOULUTUSTYYPIT,
  JULKAISUTILA,
  POHJAVALINTA,
  TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
} from '#/src/constants';

import createFormConfigBuilder from './createFormConfigBuilder';

const getKielivalinta = values => get(values, 'kieliversiot') || [];

const getMinTarjoajat = values => {
  return get(values, 'minTarjoajat', 1);
};

const validateIfJulkaistu = validate => (eb, values, ...rest) => {
  const { tila } = values;
  return tila === JULKAISUTILA.JULKAISTU ? validate(eb, values, ...rest) : eb;
};

const config = createFormConfigBuilder().registerSections([
  {
    section: 'koulutustyyppi',
    field: 'koulutustyyppi',
    koulutustyypit: KOULUTUSTYYPIT,
    validate: eb => eb.validateExistence('koulutustyyppi'),
    required: true,
  },
  {
    section: 'pohja',
    koulutustyypit: KOULUTUSTYYPIT,
    parts: [
      {
        field: '.tapa',
        required: true,
      },
      {
        field: '.valinta',
        validate: (eb, values) =>
          get(values, 'pohja.tapa') === POHJAVALINTA.KOPIO
            ? eb.validateExistence('pohja.valinta')
            : eb,
      },
    ],
  },
  {
    section: 'kieliversiot',
    field: 'kieliversiot',
    koulutustyypit: KOULUTUSTYYPIT,
    validate: eb => eb.validateArrayMinLength('kieliversiot', 1),
    required: true,
  },
  {
    section: 'information',
    parts: [
      {
        field: '.koulutus',
        fragment: 'koulutuskoodiTiedoilla',
        koulutustyypit: TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
        validate: eb => eb.validateExistence('information.koulutus'),
        required: true,
      },
      {
        field: '.eperuste',
        koulutustyypit: TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
        validate: validateIfJulkaistu(eb =>
          eb.validateExistence('information.eperuste'),
        ),
        required: true,
      },
      {
        field: '.koulutus',
        fragment: 'koulutuskoodi',
        koulutustyypit: [
          ...TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
          KOULUTUSTYYPPI.VALMA,
          KOULUTUSTYYPPI.TELMA,
          KOULUTUSTYYPPI.LUVA,
          KOULUTUSTYYPPI.PERUSOPETUKSEN_LISAOPETUS,
        ],
        validate: eb => eb.validateExistence('information.koulutus'),
        required: true,
      },
      {
        field: '.koulutus',
        fragment: 'osaamisala',
        koulutustyypit: [
          KOULUTUSTYYPPI.LUKIOKOULUTUS,
          KOULUTUSTYYPPI.OSAAMISALA,
        ],
        validate: eb => eb.validateExistence('information.koulutus'),
        required: true,
      },
      {
        field: '.nimi',
        koulutustyypit: [
          ...TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
          KOULUTUSTYYPPI.AVOIN_YO,
          KOULUTUSTYYPPI.AVOIN_AMK,
          KOULUTUSTYYPPI.TAYDENNYS_KOULUTUS,
          KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS,
          KOULUTUSTYYPPI.AMMATILLINEN_OPETTAJAKOULUTUS,
          KOULUTUSTYYPPI.AMMATILLINEN_ERITYISOPETTAJA_KOULUTUS,
          KOULUTUSTYYPPI.AMMATILLINEN_OPINTO_OHJAAJA_KOULUTUS,
        ],
        validate: (eb, values) =>
          eb.validateTranslations('information.nimi', getKielivalinta(values)),
        required: true,
      },
      {
        field: '.opintojenLaajuus',
        koulutustyypit: TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
      },
      {
        field: '.tutkintonimike',
        koulutustyypit: TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
      },
      {
        field: '.koulutusalat',
        koulutustyypit: TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
      },
    ],
  },
  {
    section: 'description',
    parts: [
      {
        field: '.nimi',
        koulutustyypit: TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
        required: true,
        validate: validateIfJulkaistu((eb, values) =>
          eb.validateTranslations('description.nimi', getKielivalinta(values)),
        ),
      },
      {
        field: '.kuvaus',
        koulutustyypit: TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
      },
      {
        fragment: 'tekstiKuvaus',
        koulutustyypit: [
          ...TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
          KOULUTUSTYYPPI.LUKIOKOULUTUS,
          KOULUTUSTYYPPI.OSAAMISALA,
        ],
      },
    ],
  },
  {
    section: 'lisatiedot',
    koulutustyypit: KOULUTUSTYYPIT,
    parts: [
      {
        field: '.osiot',
      },
      {
        field: '.osioKuvaukset',
      },
    ],
  },
  {
    section: 'teemakuva',
    field: 'teemakuva',
    koulutustyypit: KOULUTUSTYYPIT,
  },
  {
    section: 'tarjoajat',
    field: 'tarjoajat',
    koulutustyypit: KOULUTUSTYYPIT,
    validate: validateIfJulkaistu((eb, values) =>
      eb.validateArrayMinLength('tarjoajat', getMinTarjoajat(values)),
    ),
    required: true,
  },
  {
    section: 'julkinen',
    field: 'julkinen',
    koulutustyypit: KOULUTUSTYYPIT,
  },
  {
    section: 'tila',
    field: 'tila',
    koulutustyypit: KOULUTUSTYYPIT,
    validate: eb => eb.validateExistence('tila'),
    required: true,
  },
]);

const getKoulutusFormConfig = koulutustyyppi => {
  return config.getKoulutustyyppiConfig(koulutustyyppi);
};

export default getKoulutusFormConfig;
