import { get } from 'lodash';

import { JULKAISUTILA, POHJAVALINTA } from '#/src/constants';

import createFormConfigBuilder from './createFormConfigBuilder';

const getKielivalinta = values => get(values, 'kieliversiot') || [];

const validateIfJulkaistu = validate => (eb, values, ...rest) => {
  const { tila } = values;
  return tila === JULKAISUTILA.JULKAISTU ? validate(eb, values, ...rest) : eb;
};

const config = createFormConfigBuilder().registerSections([
  {
    section: 'koulutustyyppi',
    field: 'koulutustyyppi',
    validate: eb => eb.validateExistence('koulutustyyppi'),
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
    section: 'kieliversiot',
    field: 'kieliversiot',
    validate: eb => eb.validateArrayMinLength('kieliversiot', 1),
    required: true,
  },
  {
    section: 'tiedot',
    parts: [
      {
        field: '.nimi',
        validate: validateIfJulkaistu((eb, values) =>
          eb.validateTranslations('tiedot.nimi', getKielivalinta(values)),
        ),
      },
      {
        field: '.kuvaus',
        validate: validateIfJulkaistu((eb, values) =>
          eb.validateTranslations('tiedot.kuvaus', getKielivalinta(values)),
        ),
      },
    ],
  },
  {
    section: 'julkinen',
    field: 'julkinen',
  },
  {
    section: 'tila',
    field: 'tila',
    validate: eb => eb.validateExistence('tila'),
    required: true,
  },
]);

const getSoraKuvausFormConfig = () => config.getConfig();

export default getSoraKuvausFormConfig;
