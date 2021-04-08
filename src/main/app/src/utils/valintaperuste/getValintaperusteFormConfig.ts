import { KOULUTUSTYYPIT, KOULUTUSTYYPPI } from '#/src/constants';
import createFormConfigBuilder from '#/src/utils/form/createFormConfigBuilder';
import {
  validateIfJulkaistu,
  getKielivalinta,
  pohjaValintaSectionConfig,
  julkinenSectionConfig,
  valintakokeetSection,
  validateOptionalTranslatedField,
  validateRelations,
} from '#/src/utils/form/formConfigUtils';

const koulutustyypitWithValintatapa = [
  KOULUTUSTYYPPI.YLIOPISTOKOULUTUS,
  KOULUTUSTYYPPI.AMKKOULUTUS,
  KOULUTUSTYYPPI.AMMATILLINEN_OPETTAJAKOULUTUS,
  KOULUTUSTYYPPI.AMMATILLINEN_OPINTO_OHJAAJA_KOULUTUS,
  KOULUTUSTYYPPI.AMMATILLINEN_ERITYISOPETTAJA_KOULUTUS,
];

const config = createFormConfigBuilder().registerSections([
  pohjaValintaSectionConfig,
  {
    section: 'perustiedot',
    koulutustyypit: KOULUTUSTYYPIT,
    parts: [
      {
        field: '.tyyppi',
        validate: eb => eb.validateExistence('perustiedot.tyyppi'),
        required: true,
      },
      {
        field: '.kieliversiot',
        validate: eb =>
          eb.validateArrayMinLength('perustiedot.kieliversiot', 1),
        required: true,
      },
      {
        field: '.hakutapa',
        validate: validateIfJulkaistu(eb =>
          eb.validateExistence('perustiedot.hakutapa')
        ),
        required: true,
      },
      {
        field: '.kohdejoukko',
        validate: validateIfJulkaistu(eb =>
          eb.validateExistence('perustiedot.kohdejoukko')
        ),
        required: true,
      },
    ],
  },
  {
    section: 'kuvaus',
    koulutustyypit: KOULUTUSTYYPIT,
    fields: {
      '.nimi': {
        validate: (eb, values) =>
          eb.validateTranslations('kuvaus.nimi', getKielivalinta(values)),
        required: true,
      },
      '.kuvaus': {
        validate: validateOptionalTranslatedField('kuvaus.kuvaus'),
      },
    },
  },
  {
    section: 'valintatavat',
    koulutustyypit: koulutustyypitWithValintatapa,
    fields: {
      valintatavat: {
        validate: validateIfJulkaistu(eb =>
          eb
            .validateArrayMinLength('valintatavat', 1, {
              isFieldArray: true,
            })
            .validateArray('valintatavat', eb =>
              eb
                .validateExistence('tapa')
                .validateTranslations('nimi', getKielivalinta(eb.getValues()))
            )
        ),
      },
      '.tapa': {
        required: true,
      },
      '.nimi': {
        required: true,
      },
    },
  },
  {
    section: 'soraKuvaus',
    koulutustyypit: KOULUTUSTYYPIT,
    field: 'soraKuvaus',
  },
  julkinenSectionConfig,
  {
    section: 'tila',
    koulutustyypit: KOULUTUSTYYPIT,
    field: 'tila',
    required: true,
    validate: (eb, values) =>
      validateRelations([
        {
          key: 'soraKuvaus',
          t: 'yleiset.soraKuvaus',
        },
      ])(eb.validateExistence('tila'), values),
  },
  valintakokeetSection,
  {
    section: 'esikatselu',
    field: 'esikatselu',
    koulutustyypit: KOULUTUSTYYPIT,
  },
]);

const getValintaperusteFormConfig = koulutustyyppi => {
  return config.getConfig(koulutustyyppi);
};

export default getValintaperusteFormConfig;
