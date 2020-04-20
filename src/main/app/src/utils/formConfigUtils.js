import _ from 'lodash';

import { KOULUTUSTYYPIT, JULKAISUTILA, POHJAVALINTA } from '../constants';

export const validateIfJulkaistu = validate => (eb, values, ...rest) => {
  const { tila } = values;

  return tila === JULKAISUTILA.JULKAISTU ? validate(eb, values, ...rest) : eb;
};

export const kieliversiotSectionConfig = {
  section: 'kieliversiot',
  koulutustyypit: KOULUTUSTYYPIT,
  field: 'kieliversiot',
  validate: eb => eb.validateArrayMinLength('kieliversiot', 1),
  required: true,
};

export const getKielivalinta = values =>
  _.get(values, 'kieliversiot') ||
  _.get(values, 'perustiedot.kieliversiot') ||
  [];

export const pohjaValintaSectionConfig = {
  koulutustyypit: KOULUTUSTYYPIT,
  section: 'pohja',
  parts: [
    {
      field: '.tapa',
      required: true,
    },
    {
      field: '.valinta',
      validate: (eb, values) =>
        _.get(values, 'pohja.tapa') === POHJAVALINTA.KOPIO
          ? eb.validateExistence('pohja.valinta')
          : eb,
    },
  ],
};

export const koulutustyyppiSectionConfig = {
  koulutustyypit: KOULUTUSTYYPIT,
  section: 'koulutustyyppi',
  field: 'koulutustyyppi',
  validate: eb => eb.validateExistence('koulutustyyppi'),
  required: true,
};

export const tilaSectionConfig = {
  koulutustyypit: KOULUTUSTYYPIT,
  section: 'tila',
  field: 'tila',
  required: true,
  validate: eb => eb.validateExistence('tila'),
};

export const julkinenSectionConfig = {
  koulutustyypit: KOULUTUSTYYPIT,
  section: 'julkinen',
  field: 'julkinen',
};
