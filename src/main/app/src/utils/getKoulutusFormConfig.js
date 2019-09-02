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
    koulutustyyppi: {
      fields: {
        koulutustyyppi: {
          validate: eb => eb.validateExistence('koulutustyyppi'),
        },
      },
    },
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
    tiedot: {
      fields: {
        koulutuskoodiTiedoilla: {
          validate: eb => eb.validateExistence('information.koulutus'),
        },
        koulutuskoodi: {
          validate: eb => eb.validateExistence('information.koulutus'),
        },
        osaamisala: {
          validate: eb => eb.validateExistence('information.koulutus'),
        },
        opintojenlaajuus: true,
        tutkintonimike: true,
        koulutusalat: true,
        nimi: true,
      },
    },
    kuvaus: {
      fields: {
        nimi: true,
        kuvaus: {
          validate: validateIfJulkaistu((eb, values) =>
            eb.validateTranslations(
              'description.kuvaus',
              getKielivalinta(values),
            ),
          ),
        },
        tekstiKuvaus: true,
      },
    },
    lisatiedot: {
      fields: {
        osiot: true,
      },
    },
    jarjestyspaikka: {
      fields: {
        jarjestyspaikka: {
          validate: validateIfJulkaistu(eb =>
            eb.validateArrayMinLength('tarjoajat', 1),
          ),
        },
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
  },
};

const commonConfigPaths = [
  'sections.koulutustyyppi',
  'sections.pohja',
  'sections.kieliversiot',
  'sections.jarjestyspaikka',
  'sections.julkaisutila',
];

const getKoulutusFormConfig = koulutustyyppi => {
  if (isKorkeakouluKoulutustyyppi(koulutustyyppi)) {
    return pick(baseConfig, [
      ...commonConfigPaths,
      'sections.tiedot.fields.koulutuskoodi',
      'sections.tiedot.fields.opintojenlaajuus',
      'sections.tiedot.fields.tutkintonimike',
      'sections.tiedot.fields.koulutusalat',
      'sections.tiedot.fields.nimi',
      'sections.kuvaus.fields.nimi',
      'sections.kuvaus.fields.kuvaus',
      'sections.lisatiedot',
      'sections.julkisuus',
    ]);
  } else if (isAmmatillinenKoulutustyyppi(koulutustyyppi)) {
    return pick(baseConfig, [
      ...commonConfigPaths,
      'sections.tiedot.fields.koulutuskoodiTiedoilla',
      'sections.kuvaus.fields.tekstiKuvaus',
      'sections.lisatiedot',
    ]);
  } else if (koulutustyyppi === KOULUTUSTYYPPI.LUKIOKOULUTUS) {
    return pick(baseConfig, [
      ...commonConfigPaths,
      'sections.tiedot.fields.osaamisala',
      'sections.kuvaus.fields.tekstiKuvaus',
      'sections.lisatiedot',
    ]);
  }

  return pick(baseConfig, commonConfigPaths);
};

export default getKoulutusFormConfig;
