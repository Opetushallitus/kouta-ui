import get from 'lodash/get';

import {JULKAISUTILA, KOULUTUSTYYPIT, KOULUTUSTYYPPI} from '../constants';

const getKielivalinta = values => get(values, 'kieliversiot') || [];

const validateIfJulkaistu = validate => (eb, values, ...rest) => {
  const { tila } = values;

  return tila === JULKAISUTILA.JULKAISTU ? validate(eb, values, ...rest) : eb;
};

const getValintaperusteFormConfig = koulutustyyppi => {
  let sections = {
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
    julkaisutila: {
      fields: {
        julkaisutila: {
          validate: eb => eb.validateExistence('tila'),
        },
      },
    },
    valintakoe: {
      fields: {
        valintakoe: true,
      },
    },
  };

  const koulutustyypitWithValintatapa = [
    KOULUTUSTYYPPI.YLIOPISTOKOULUTUS,
    KOULUTUSTYYPPI.AMKKOULUTUS,
    KOULUTUSTYYPPI.AMMATILLINEN_OPETTAJAKOULUTUS,
    KOULUTUSTYYPPI.AMMATILLINEN_OPINTO_OHJAAJA_KOULUTUS,
    KOULUTUSTYYPPI.AMMATILLINEN_ERITYISOPETTAJA_KOULUTUS,
  ];

  if (koulutustyyppi === undefined || koulutustyypitWithValintatapa.includes(koulutustyyppi)) {
    sections.valintatapa = {
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
    };
  }

  let baseConfig = {
    sections: sections,
  };

  return { ...baseConfig };
};

export default getValintaperusteFormConfig;
