import { cond, flow, get } from 'lodash';
import { ifAny, otherwise } from '../utils';
import { JULKAISUTILA, HAKULOMAKETYYPPI, POHJAVALINTA } from '../constants';
import isYhteishakuHakutapa from './isYhteishakuHakutapa';
import isErillishakuHakutapa from './isErillishakuHakutapa';
import createFormConfigBuilder from './createFormConfigBuilder';

const getKielivalinta = values => get(values, 'kieliversiot') || [];

const getHakutapa = values => get(values, 'hakutapa');

const validateIfJulkaistu = validate => (eb, values, ...rest) => {
  const { tila } = values;

  return tila === JULKAISUTILA.JULKAISTU ? validate(eb, values, ...rest) : eb;
};

const config = createFormConfigBuilder().registerSections([
  {
    section: 'kieliversiot',
    field: 'kieliversiot',
    validate: eb => eb.validateArrayMinLength('kieliversiot', 1),
    required: true,
  },
  {
    section: 'pohja',
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
    section: 'nimi',
    parts: [
      {
        field: 'nimi',
        required: true,
        validate: (eb, values) =>
          eb.validateTranslations('nimi', getKielivalinta(values)),
      },
    ],
  },
  {
    section: 'kohdejoukko',
    parts: [
      {
        field: '.kohdejoukko',
        required: true,
      },
      {
        field: '.tarkenne',
      },
    ],
  },
  {
    section: 'hakutapa',
    parts: [
      {
        field: 'hakutapa',
        required: true,
        validate: validateIfJulkaistu(eb => eb.validateExistence('hakutapa')),
      },
    ],
  },
  {
    section: 'aikataulut',
    parts: [
      {
        field: '.hakuaika',
        validate: validateIfJulkaistu((errorBoundary, values) =>
          errorBoundary
            .validateArrayMinLength('aikataulut.hakuaika', 1, {
              isFieldArray: true,
            })
            .validateArray('aikataulut.hakuaika', eb => {
              const hakutapa = getHakutapa(values);
              const isErillishaku = isErillishakuHakutapa(hakutapa);
              const isYhteishaku = isYhteishakuHakutapa(hakutapa);

              return flow([
                eb => eb.validateExistence('alkaa'),
                eb =>
                  isYhteishaku || isErillishaku
                    ? eb.validateExistence('paattyy')
                    : eb,
              ])(eb);
            }),
        ),
      },
      {
        field: '.hakuaika.alkaa',
        required: true,
      },
      {
        field: '.aikataulu',
      },
      {
        field: '.kausi',
        validate: validateIfJulkaistu((eb, values) => {
          const hakutapa = getHakutapa(values);
          const isYhteishaku = isYhteishakuHakutapa(hakutapa);

          return isYhteishaku
            ? eb
                .validateExistence('aikataulut.kausi')
                .validateExistence('aikataulut.vuosi')
            : eb;
        }),
      },
      {
        field: '.vuosi',
      },
      {
        field: '.lisaamisenTakaraja',
      },
      {
        field: '.muokkauksenTakaraja',
      },
      {
        field: '.ajastettuJulkaisu',
      },
    ],
  },
  {
    section: 'hakulomake',
    parts: [
      {
        field: '.tyyppi',
        required: true,
        validate: validateIfJulkaistu(
          (eb, values) =>
            eb.validateExistence('hakulomake.tyyppi') &&
            cond([
              [
                ifAny(HAKULOMAKETYYPPI.ATARU),
                () => eb.validateExistence('hakulomake.lomake'),
              ],
              [
                ifAny(HAKULOMAKETYYPPI.MUU),
                () =>
                  eb.validateTranslations(
                    'hakulomake.linkki',
                    getKielivalinta(values),
                  ),
              ],
              [
                ifAny(HAKULOMAKETYYPPI.EI_SAHKOISTA_HAKUA),
                () =>
                  eb.validateTranslations(
                    'hakulomake.kuvaus',
                    getKielivalinta(values),
                  ),
              ],
              [otherwise, () => eb],
            ])(tyyppi => get(values, 'hakulomake.tyyppi') === tyyppi),
        ),
      },
      {
        required: true,
        field: '.lomake',
      },
      {
        required: true,
        field: '.linkki',
      },
      {
        field: '.kuvaus',
      },
    ],
  },
  {
    section: 'yhteyshenkilot',
    field: 'yhteyshenkilot',
  },
  {
    section: 'tila',
    field: 'tila',
    required: true,
    validate: eb => eb.validateExistence('tila'),
  },
]);

const getHakuFormConfig = () => {
  return config.getConfig();
};

export default getHakuFormConfig;
