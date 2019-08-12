import pick from 'lodash/pick';
import get from 'lodash/get';

import { KOULUTUSTYYPPI, JULKAISUTILA } from '../constants';
import isKorkeakouluKoulutustyyppi from './isKorkeakouluKoulutustyyppi';
import isAmmatillinenKoulutustyyppi from './isAmmatillinenKoulutustyyppi';

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
    kieliversiot: {
      fields: {
        kieliversiot: {
          validate: eb => eb.validateArrayMinLength('kieliversiot', 1),
        },
      },
    },
    kuvaus: {
      fields: {
        kuvaus: true,
      },
    },
    osaamisalaTarkenteet: {
      fields: {
        osaamisalat: true,
      },
    },
    osaamisalatYlempitutkinto: {
      fields: {
        osaamisalat: {
          validate: validateIfJulkaistu((eb, values) =>
            eb.validateArray('alemmanKorkeakoulututkinnonOsaamisalat', eb => {
              return eb.validateTranslations('nimi', getKielivalinta(values));
            }),
          ),
        },
      },
    },
    osaamisalatAlempitutkinto: {
      fields: {
        osaamisalat: {
          validate: validateIfJulkaistu((eb, values) =>
            eb.validateArray('alemmanKorkeakoulututkinnonOsaamisalat', eb => {
              return eb.validateTranslations('nimi', getKielivalinta(values));
            }),
          ),
        },
      },
    },
    jarjestamistiedot: {
      fields: {
        opetuskieli: {
          validate: validateIfJulkaistu(eb =>
            eb.validateArrayMinLength('jarjestamistiedot.opetuskieli', 1),
          ),
        },
        opetusaika: {
          validate: validateIfJulkaistu(eb =>
            eb.validateArrayMinLength('jarjestamistiedot.opetusaika', 1),
          ),
        },
        opetustapa: true,
        maksullisuus: {
          validate: validateIfJulkaistu(eb =>
            eb.validateExistence('jarjestamistiedot.maksullisuus.tyyppi'),
          ),
        },
        stipendi: true,
        alkamiskausi: true,
        osiot: true,
      },
    },
    nayttamistiedot: {
      fields: {
        ammattinimikkeet: true,
        avainsanat: true,
      },
    },
    jarjestyspaikka: {
      fields: {
        jarjestyspaikka: {
          validate: validateIfJulkaistu(eb =>
            eb.validateArrayMinLength('jarjestamispaikat', 1),
          ),
        },
      },
    },
    nimi: {
      fields: {
        nimi: {
          validate: (eb, values) =>
            eb.valitaTranslations('nimi', getKielivalinta(values)),
        },
      },
    },
    yhteystiedot: {
      fields: {
        yhteyshenkilot: true,
      },
    },
  },
};

const commonConfigPaths = [
  'sections.pohja',
  'sections.kieliversiot',
  'sections.jarjestyspaikka',
  'sections.yhteystiedot',
];

const getToteutusFormConfig = koulutustyyppi => {
  if (isKorkeakouluKoulutustyyppi(koulutustyyppi)) {
    return pick(baseConfig, [
      ...commonConfigPaths,
      'sections.osaamisalatYlempitutkinto',
      'sections.osaamisalatAlempitutkinto',
      'sections.kuvaus',
      'sections.jarjestamistiedot',
      'sections.nayttamistiedot',
      'sections.nimi',
    ]);
  } else if (isAmmatillinenKoulutustyyppi(koulutustyyppi)) {
    return pick(baseConfig, [
      ...commonConfigPaths,
      'sections.osaamisalaTarkenteet',
      'sections.jarjestamistiedot',
      'sections.nayttamistiedot',
      'sections.nimi',
    ]);
  } else if (koulutustyyppi === KOULUTUSTYYPPI.LUKIOKOULUTUS) {
    return pick(baseConfig, [
      ...commonConfigPaths,
      'sections.jarjestamistiedot',
      'sections.nayttamistiedot',
    ]);
  }

  return pick(baseConfig, commonConfigPaths);
};

export default getToteutusFormConfig;
