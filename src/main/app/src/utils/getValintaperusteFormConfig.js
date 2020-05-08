import { get, reduce } from 'lodash';

import { KOULUTUSTYYPIT, KOULUTUSTYYPPI } from '../constants';
import createFormConfigBuilder from './createFormConfigBuilder';

import {
  validateIfJulkaistu,
  getKielivalinta,
  pohjaValintaSectionConfig,
  julkinenSectionConfig,
  validateRelations,
} from '#/src/utils/formConfigUtils';

const koulutustyypitWithValintatapa = [
  KOULUTUSTYYPPI.YLIOPISTOKOULUTUS,
  KOULUTUSTYYPPI.AMKKOULUTUS,
  KOULUTUSTYYPPI.AMMATILLINEN_OPETTAJAKOULUTUS,
  KOULUTUSTYYPPI.AMMATILLINEN_OPINTO_OHJAAJA_KOULUTUS,
  KOULUTUSTYYPPI.AMMATILLINEN_ERITYISOPETTAJA_KOULUTUS,
];

const validateValintakokeet = (errorBuilder, values) => {
  const valintakoeTyypit = get(values, 'valintakoe.tyypit');
  const kieliversiot = getKielivalinta(values);

  return reduce(
    valintakoeTyypit,
    (ebAcc, { value: tyyppi }) =>
      ebAcc
        .validateArrayMinLength(`valintakoe.tilaisuudet.${tyyppi}`, 1, {
          isFieldArray: true,
        })
        .validateArray(`valintakoe.tilaisuudet.${tyyppi}`, eb =>
          eb
            .validateTranslations('osoite', kieliversiot)
            .validateExistence('postinumero')
            .validateExistence('alkaa')
            .validateExistence('paattyy'),
        ),
    errorBuilder,
  );
};

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
          eb.validateExistence('perustiedot.hakutapa'),
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
    parts: [
      {
        field: '.nimi',
        validate: (eb, values) =>
          eb.validateTranslations('kuvaus.nimi', getKielivalinta(values)),
        required: true,
      },
      {
        field: '.kuvaus',
      },
    ],
  },
  {
    section: 'valintatavat',
    koulutustyypit: koulutustyypitWithValintatapa,
    field: 'valintatavat',
    validate: validateIfJulkaistu((eb, values) =>
      eb
        .validateArrayMinLength('valintatavat', 1, {
          isFieldArray: true,
        })
        .validateArray('valintatavat', eb =>
          eb
            .validateExistence('tapa')
            .validateTranslations('nimi', getKielivalinta(values)),
        ),
    ),
    parts: [
      {
        field: '.tapa',
        required: true,
      },
      {
        field: '.nimi',
        required: true,
      },
    ],
  },
  {
    section: 'soraKuvaus',
    koulutustyypit: KOULUTUSTYYPIT,
    field: 'soraKuvaus',
    validate: validateIfJulkaistu(eb =>
      eb.validateExistence('perustiedot.hakutapa'),
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
  {
    section: 'valintakoe',
    field: 'valintakoe',
    koulutustyypit: KOULUTUSTYYPIT,
    validate: validateIfJulkaistu((eb, values) =>
      validateValintakokeet(eb, values),
    ),
  },
]);

const getValintaperusteFormConfig = koulutustyyppi => {
  return config.getKoulutustyyppiConfig(koulutustyyppi);
};

export default getValintaperusteFormConfig;
