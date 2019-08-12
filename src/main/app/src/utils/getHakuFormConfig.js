import get from 'lodash/get';

import { JULKAISUTILA } from '../constants';
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
          validate: validateIfJulkaistu(eb =>
            eb.validateExistence('kohdejoukko.kohdejoukko'),
          ),
        },
      },
    },
    aikataulu: {
      fields: {
        hakuaika: {
          validate: validateIfJulkaistu(eb =>
            eb
              .validateArrayMinLength('aikataulut.hakuaika', 1, {
                isFieldArray: true,
              })
              .validateArray('aikataulut.hakuaika', (eb, values) => {
                const hakutapa = getHakutapa(values);
                const isErillishaku = isErillishakuHakutapa(hakutapa);
                const isYhteishaku = isYhteishakuHakutapa(hakutapa);

                if (isErillishaku || isYhteishaku) {
                  return eb
                    .validateExistence('alkaa')
                    .validateExistence('paattyy');
                }

                return eb.validateExistence('alkaa');
              }),
          ),
        },
        tulevaisuudenaikataulu: true,
        alkamiskausi: true,
        lisaamisenTakaraja: true,
        muokkauksenTakaraja: true,
        ajastettuJulkaisu: true,
      },
    },
    hakulomake: {
      fields: {
        hakulomake: true,
      },
    },
    valintakoe: {
      fields: {
        valintakoe: true,
      },
    },
    yhteystiedot: {
      fields: {
        yhteyshenkilot: true,
      },
    },
  },
};

const getHakuFormConfig = () => {
  return { ...baseConfig };
};

export default getHakuFormConfig;
