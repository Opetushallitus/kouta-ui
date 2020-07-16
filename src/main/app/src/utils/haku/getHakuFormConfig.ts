import { cond, flow, get } from 'lodash';
import { ifAny, otherwise } from '#/src/utils';
import { HAKULOMAKETYYPPI } from '#/src/constants';
import isYhteishakuHakutapa from '#/src/utils/isYhteishakuHakutapa';
import isErillishakuHakutapa from '#/src/utils/isErillishakuHakutapa';
import createFormConfigBuilder from '#/src/utils/form/createFormConfigBuilder';
import {
  validateIfJulkaistu,
  getKielivalinta,
  kieliversiotSectionConfig,
  pohjaValintaSectionConfig,
  tilaSectionConfig,
} from '#/src/utils/form/formConfigUtils';

const getHakutapa = values => get(values, 'hakutapa');

const config = createFormConfigBuilder().registerSections([
  kieliversiotSectionConfig,
  pohjaValintaSectionConfig,
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
        field: '.hakuaikaGroup',
        required: true,
      },
      {
        field: '.hakuaika',
        validate: validateIfJulkaistu(
          (errorBuilder, values) =>
            errorBuilder
              .validateArrayMinLength('aikataulut.hakuaika', 1, {
                isFieldArray: true,
              })
              .validateArray('aikataulut.hakuaika', eb => {
                const hakutapa = getHakutapa(values);
                const isErillishaku = isErillishakuHakutapa(hakutapa);
                const isYhteishaku = isYhteishakuHakutapa(hakutapa);

                return flow([
                  eb => eb.validateExistenceOfDate('alkaa'),
                  eb =>
                    isYhteishaku || isErillishaku
                      ? eb.validateExistenceOfDate('paattyy')
                      : eb,
                ])(eb);
              }),
          (errorBuilder, values) =>
            errorBuilder.validateArray('aikataulut.hakuaika', eb => {
              const hakutapa = getHakutapa(values);
              const isErillishaku = isErillishakuHakutapa(hakutapa);
              const isYhteishaku = isYhteishakuHakutapa(hakutapa);

              return flow([
                eb => eb.validateExistenceOfDate('alkaa'),
                eb =>
                  isYhteishaku || isErillishaku
                    ? eb.validateExistenceOfDate('paattyy')
                    : eb,
              ])(eb);
            })
        ),
      },
      {
        field: '.hakuaika.alkaa',
        required: true,
      },
      {
        field: '.hakuaika.paattyy',
        required: values => {
          const hakutapa = getHakutapa(values);
          return (
            isYhteishakuHakutapa(hakutapa) || isErillishakuHakutapa(hakutapa)
          );
        },
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
        required: values => isYhteishakuHakutapa(getHakutapa(values)),
      },
      {
        field: '.vuosi',
        required: values => isYhteishakuHakutapa(getHakutapa(values)),
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
                    getKielivalinta(values)
                  ),
              ],
              [otherwise, () => eb],
            ])(tyyppi => get(values, 'hakulomake.tyyppi') === tyyppi)
        ),
      },
      {
        field: '.lomake',
        required: true,
      },
      {
        field: '.linkki',
        required: true,
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
  tilaSectionConfig,
]);

const getHakuFormConfig = () => {
  return config.getConfig();
};

export default getHakuFormConfig;
