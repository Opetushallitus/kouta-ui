import { get, reduce } from 'lodash';

import {
  JULKAISUTILA,
  KOULUTUSTYYPIT,
  KOULUTUSTYYPPI,
  POHJAVALINTA,
} from '../constants';
import createFormConfigBuilder from './createFormConfigBuilder';

const getKielivalinta = values => get(values, 'perustiedot.kieliversiot') || [];

const validateIfJulkaistu = validate => (eb, values, ...rest) => {
  const { tila } = values;

  return tila === JULKAISUTILA.JULKAISTU ? validate(eb, values, ...rest) : eb;
};

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
    section: 'perustiedot',
    koulutustyypit: KOULUTUSTYYPIT,
    parts: [
      {
        field: '.tyyppi',
        validate: eb => eb.validateExistence('perustiedot.tyyppi'),
      },
      {
        field: '.kieliversiot',
        validate: eb =>
          eb.validateArrayMinLength('perustiedot.kieliversiot', 1),
      },
      {
        field: '.hakutapa',
        validate: validateIfJulkaistu(eb =>
          eb.validateExistence('perustiedot.hakutapa'),
        ),
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
  },
  {
    section: 'soraKuvaus',
    koulutustyypit: KOULUTUSTYYPIT,
    field: 'soraKuvaus',
  },
  {
    section: 'julkinen',
    koulutustyypit: KOULUTUSTYYPIT,
    field: 'julkinen',
  },
  {
    section: 'tila',
    koulutustyypit: KOULUTUSTYYPIT,
    field: 'tila',
    validate: eb => eb.validateExistence('tila'),
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
