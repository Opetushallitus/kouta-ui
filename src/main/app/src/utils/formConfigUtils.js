import _ from 'lodash';
import _fp from 'lodash/fp';
import {
  validateArray,
  validateExistence,
  validateTranslations,
} from '#/src/utils/createErrorBuilder';
import { KOULUTUSTYYPIT, JULKAISUTILA, POHJAVALINTA } from '#/src/constants';

export const validateIfJulkaistu = validate => (eb, values, ...rest) => {
  const { tila } = values;

  return tila === JULKAISUTILA.JULKAISTU ? validate(eb, values, ...rest) : eb;
};

export const validateIf = (condition, validate) => eb =>
  condition ? validate(eb) : eb;

export const validateValintakokeet = (errorBuilder, values) => {
  const kieliversiot = getKielivalinta(values);
  return _fp.compose(
    validateTranslations('valintakokeet.yleisKuvaus', kieliversiot, {
      optional: true,
    }),
    validateArray(
      'valintakokeet.kokeetTaiLisanaytot',
      (eb, { liittyyEnnakkovalmistautumista, erityisjarjestelytMahdollisia }) =>
        _fp.compose(
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
            _fp.compose(
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
      const ref = _.get(values, key);
      if (
        !_.isNil(ref) &&
        tila === JULKAISUTILA.JULKAISTU &&
        _.get(ref, 'tila') !== JULKAISUTILA.JULKAISTU
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
