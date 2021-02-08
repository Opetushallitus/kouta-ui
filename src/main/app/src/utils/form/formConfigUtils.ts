import _fp from 'lodash/fp';

import { KOULUTUSTYYPIT, JULKAISUTILA, POHJAVALINTA } from '#/src/constants';
import {
  validateArray,
  validateExistence,
  validateTranslations,
} from '#/src/utils/form/createErrorBuilder';

export const validateIfJulkaistu = (
  validate,
  optionalNotJulkaistuValidator = (eb, ..._) => eb
) => (eb, values, ...rest) => {
  const { tila } = values;

  return tila === JULKAISUTILA.JULKAISTU
    ? validate(eb, values, ...rest)
    : optionalNotJulkaistuValidator(eb, values, ...rest);
};

export const validateIf = (condition, validate) => eb =>
  condition ? validate(eb) : eb;

export const validateValintakokeet = (errorBuilder, values) => {
  const kieliversiot = getKielivalinta(values);
  return _fp.flow(
    validateTranslations('valintakokeet.yleisKuvaus', kieliversiot, {
      optional: true,
    }),
    validateArray(
      'valintakokeet.kokeetTaiLisanaytot',
      (eb, { liittyyEnnakkovalmistautumista, erityisjarjestelytMahdollisia }) =>
        _fp.flow(
          validateExistence('tyyppi'),
          validateIf(
            liittyyEnnakkovalmistautumista,
            validateTranslations('ohjeetEnnakkovalmistautumiseen', kieliversiot)
          ),
          validateIf(
            erityisjarjestelytMahdollisia,
            validateTranslations('ohjeetErityisjarjestelyihin', kieliversiot, {
              optional: true,
            })
          ),
          validateTranslations('nimi', kieliversiot, { optional: true }),
          validateTranslations('tietoaHakijalle', kieliversiot, {
            optional: true,
          }),
          validateArray(
            'tilaisuudet',
            _fp.flow(
              validateTranslations('osoite', kieliversiot),
              validateExistence('postinumero'),
              validateExistence('alkaa'),
              validateExistence('paattyy'),
              validateTranslations('jarjestamispaikka', kieliversiot, {
                optional: true,
              }),
              validateTranslations('lisatietoja', kieliversiot, {
                optional: true,
              })
            )
          )
        )(eb)
    )
  )(errorBuilder);
};

export const kieliversiotSectionConfig = {
  section: 'kieliversiot',
  koulutustyypit: KOULUTUSTYYPIT,
  field: 'kieliversiot',
  validate: eb => eb.validateArrayMinLength('kieliversiot', 1),
  required: true,
};

export const getKielivalinta = values =>
  _fp.get('kieliversiot', values) ||
  _fp.get('perustiedot.kieliversiot', values) ||
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
        _fp.get('pohja.tapa', values) === POHJAVALINTA.KOPIO
          ? eb.validateExistence('pohja.valinta')
          : eb,
    },
  ],
};

export const koulutustyyppiSectionConfig = {
  koulutustyypit: KOULUTUSTYYPIT,
  section: 'koulutustyyppi',
  field: 'koulutustyyppi',
  validate: validateExistence('koulutustyyppi'),
  required: true,
};

export const tilaSectionConfig = {
  koulutustyypit: KOULUTUSTYYPIT,
  section: 'tila',
  field: 'tila',
  required: true,
  validate: validateExistence('tila'),
};

export const julkinenSectionConfig = {
  koulutustyypit: KOULUTUSTYYPIT,
  section: 'julkinen',
  field: 'julkinen',
};

export const validateRelations = specs => (eb, values) => {
  const { errors, isValid } = specs.reduce(
    (acc, { key, t: translationKey }) => {
      const { tila } = values;
      const ref = _fp.get(key, values);
      if (
        !_fp.isNil(ref) &&
        tila === JULKAISUTILA.JULKAISTU &&
        _fp.get('tila', ref) !== JULKAISUTILA.JULKAISTU
      ) {
        acc.isValid = false;
        acc.errors.push(t =>
          t('yleiset.riippuvuusEiJulkaistu', {
            entity: t(translationKey),
          })
        );
      }
      return acc;
    },
    { isValid: true, errors: [] }
  );

  return eb.validate('tila', () => isValid, { message: errors });
};

export const createOptionalTranslatedFieldConfig = ({
  name,
  koulutustyypit,
}: {
  name: string;
  koulutustyypit?: typeof KOULUTUSTYYPIT;
}) => ({
  field: name,
  koulutustyypit,
  validate: validateOptionalTranslatedField(name),
});

export const validateOptionalTranslatedField = name =>
  validateIfJulkaistu((eb, values) =>
    eb.validateTranslations(name, getKielivalinta(values), {
      optional: true,
    })
  );

export const valintakokeetSection = {
  section: 'valintakokeet',
  field: 'valintakokeet',
  koulutustyypit: KOULUTUSTYYPIT,
  validate: validateIfJulkaistu(validateValintakokeet),
  fields: {
    '.kokeetTaiLisanaytot': {
      fields: {
        '.tyyppi': {
          required: true,
        },
        '.ohjeetEnnakkovalmistautumiseen': {
          required: true,
        },
        '.tilaisuudet': {
          fields: {
            '.alkaa': {
              required: true,
            },
            '.paattyy': {
              required: true,
            },
            '.osoite': {
              required: true,
            },
            '.postinumero': {
              required: true,
            },
          },
        },
      },
    },
  },
};
