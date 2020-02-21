import { cond, flow, get } from 'lodash';
import { ifAny, otherwise } from '../utils';
import { JULKAISUTILA, HAKULOMAKETYYPPI } from '../constants';
import isYhteishakuHakutapa from './isYhteishakuHakutapa';
import isErillishakuHakutapa from './isErillishakuHakutapa';

const getKielivalinta = values => get(values, 'kieliversiot') || [];

const getHakutapa = values => get(values, 'hakutapa');

const validateIfJulkaistu = validate => (eb, values, ...rest) => {
  const { tila } = values;

  return tila === JULKAISUTILA.JULKAISTU ? validate(eb, values, ...rest) : eb;
};

const baseConfig = {
  sections: {
    pohja: {
      fields: {
        pohja: true,
      },
    },
    kieliversiot: {
      fields: {
        kieliversiot: {
          validate: eb => eb.validateArrayMinLength('kieliversiot', 1),
        },
      },
    },
    nimi: {
      fields: {
        nimi: {
          validate: (eb, values) =>
            eb.validateTranslations('nimi', getKielivalinta(values)),
        },
      },
    },
    kohdejoukko: {
      fields: {
        kohdejoukko: {
          validate: validateIfJulkaistu(eb =>
            eb.validateExistence('kohdejoukko.kohdejoukko'),
          ),
        },
      },
    },
    hakutapa: {
      fields: {
        hakutapa: {
          validate: validateIfJulkaistu(eb => eb.validateExistence('hakutapa')),
        },
      },
    },
    aikataulu: {
      fields: {
        hakuaika: {
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
        tulevaisuudenaikataulu: true,
        alkamiskausi: {
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
        lisaamisenTakaraja: true,
        muokkauksenTakaraja: true,
        ajastettuJulkaisu: true,
      },
    },
    hakulomake: {
      fields: {
        hakulomake: {
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
      },
    },
    yhteystiedot: {
      fields: {
        yhteyshenkilot: true,
      },
    },
    julkaisutila: {
      fields: {
        julkaisutila: {
          validate: eb => eb.validateExistence('tila'),
        },
      },
    },
  },
};

const getHakuFormConfig = () => {
  return { ...baseConfig };
};

export default getHakuFormConfig;
