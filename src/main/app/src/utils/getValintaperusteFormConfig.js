import _ from 'lodash';

import { KOULUTUSTYYPIT, KOULUTUSTYYPPI } from '../constants';
import createFormConfigBuilder from './createFormConfigBuilder';

import {
  validateIfJulkaistu,
  getKielivalinta,
  pohjaValintaSectionConfig,
  julkinenSectionConfig,
  validateRelations,
  valintakokeetSection,
} from '#/src/utils/formConfigUtils';

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
      '.kuvaus': true,
    },
  },
  {
    section: 'valintatavat',
    koulutustyypit: koulutustyypitWithValintatapa,
    fields: {
      valintatavat: {
        validate: validateIfJulkaistu((eb, values) =>
          eb
            .validateArrayMinLength('valintatavat', 1, {
              isFieldArray: true,
            })
            .validateArray('valintatavat', eb =>
              eb
                .validateExistence('tapa')
                .validateTranslations('nimi', getKielivalinta(values))
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
    validate: validateIfJulkaistu(eb =>
      eb.validateExistence('perustiedot.hakutapa')
    ),
    required: true,
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
]);

const getValintaperusteFormConfig = koulutustyyppi => {
  return config.getKoulutustyyppiConfig(koulutustyyppi);
};

export default getValintaperusteFormConfig;
