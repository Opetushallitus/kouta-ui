import _fp from 'lodash/fp';

import { KOULUTUSTYYPIT, JULKAISUTILA, POHJAVALINTA } from '#/src/constants';
import {
  validateArray,
  validateExistence,
  validateTranslations,
} from '#/src/utils/form/createErrorBuilder';

export const validateIfJulkaistu = (...validateFns) => eb => {
  const { tila } = eb.getValues();
  return tila === JULKAISUTILA.JULKAISTU ? _fp.flow(...validateFns)(eb) : eb;
};

export const validateIf = (condition, ...validateFns) => eb =>
  condition ? _fp.flow(...validateFns)(eb) : eb;

export const validateValintakokeet = errorBuilder => {
  const values = errorBuilder.getValues();
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

export const tilaSectionConfig = {
  koulutustyypit: KOULUTUSTYYPIT,
  section: 'tila',
  field: 'tila',
  required: true,
  validate: validateExistence('tila'),
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
  validateIfJulkaistu(eb =>
    eb.validateTranslations(name, getKielivalinta(eb.getValues()), {
      optional: true,
    })
  );

export const validatePohja = eb =>
  validateIf(
    eb.getValues()?.pohja?.tapa === POHJAVALINTA.KOPIO,
    validateExistence('pohja.valinta')
  )(eb);
