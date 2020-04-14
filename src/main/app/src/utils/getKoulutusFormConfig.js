import { get } from 'lodash';

import {
  KOULUTUSTYYPPI,
  KOULUTUSTYYPIT,
  JULKAISUTILA,
  POHJAVALINTA,
  TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
} from '../constants';

import createFormConfigBuilder from './createFormConfigBuilder';

const getKielivalinta = values => get(values, 'kieliversiot') || [];

const getMinTarjoajat = values => {
  return get(values, 'minTarjoajat', 1);
};

const validateIfJulkaistu = validate => (eb, values, ...rest) => {
  const { tila } = values;
  return tila === JULKAISUTILA.JULKAISTU ? validate(eb, values, ...rest) : eb;
};

const config = createFormConfigBuilder().registerFieldTree([
  {
    section: 'koulutustyyppi',
    field: 'koulutustyyppi',
    koulutustyypit: KOULUTUSTYYPIT,
    validate: eb => eb.validateExistence('koulutustyyppi'),
    required: true,
  },
  {
    section: 'pohja',
    field: 'pohja',
    koulutustyypit: KOULUTUSTYYPIT,
    validate: (eb, values) =>
      get(values, 'pohja.tapa') === POHJAVALINTA.KOPIO
        ? eb.validateExistence('pohja.valinta')
        : eb,
    required: true,
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
    fields: [
      {
        name: 'koulutuskoodiTiedoilla', // id of the form config
        formFieldName: 'information.koulutus', // name of the form field (redux-form)
        koulutustyypit: TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
        validate: eb => eb.validateExistence('information.koulutus'),
        required: true,
      },
      {
        name: 'koulutuskoodi',
        formFieldName: 'information.koulutus',
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
        name: 'nimi',
        formFieldName: 'information.nimi',
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
        name: 'osaamisala',
        formFieldName: 'information.koulutus',
        koulutustyypit: [
          KOULUTUSTYYPPI.LUKIOKOULUTUS,
          KOULUTUSTYYPPI.OSAAMISALA,
        ],
        validate: eb => eb.validateExistence('information.koulutus'),
        required: true,
      },
      {
        name: 'opintojenlaajuus',
        koulutustyypit: TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
      },
      {
        name: 'tutkintonimike',
        koulutustyypit: TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
      },
      {
        name: 'koulutusalat',
        koulutustyypit: TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
      },
    ],
  },
  {
    section: 'description',
    fields: [
      {
        name: 'nimi',
        formFieldName: 'description.nimi',
        koulutustyypit: TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
        validate: validateIfJulkaistu((eb, values) =>
          eb.validateTranslations('description.nimi', getKielivalinta(values)),
        ),
        required: true,
      },
      {
        name: 'kuvaus',
        koulutustyypit: TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
      },
      {
        name: 'tekstiKuvaus',
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
    field: 'osiot',
    koulutustyypit: KOULUTUSTYYPIT,
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
    section: 'esikatselu',
    field: 'esikatselu',
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
