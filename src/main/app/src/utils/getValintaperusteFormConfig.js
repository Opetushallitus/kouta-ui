import get from 'lodash/get';

import { JULKAISUTILA } from '../constants';

const getKielivalinta = values => get(values, 'kieliversiot') || [];

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
    perustiedot: {
      fields: {
        koulutustyyppi: {
          validate: eb => eb.validateExistence('tyyppi'),
        },
        kieliversiot: {
          validate: eb => eb.validateArrayMinLength('kieliversiot', 1),
        },
        hakutapa: {
          validate: validateIfJulkaistu(eb => eb.validateExistence('hakutapa')),
        },
        haunkohdejoukko: {
          validate: validateIfJulkaistu(eb =>
            eb.validateExistence('kohdejoukko'),
          ),
        },
      },
    },
    kuvaus: {
      fields: {
        nimi: {
          validate: (eb, values) =>
            eb.validateTranslations('kuvaus.nimi', getKielivalinta(values)),
        },
        tarkenne: true,
      },
    },
    valintatapa: {
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
                  .validateTranslations('nimi', getKielivalinta(values)),
              ),
          ),
        },
      },
    },
    soraKuvaus: {
      fields: {
        soraKuvaus: true,
      },
    },
    julkisuus: {
      fields: {
        julkisuus: true,
      },
    },
  },
};

const getValintaperusteFormConfig = () => {
  return { ...baseConfig };
};

export default getValintaperusteFormConfig;
