import _fp from 'lodash/fp';

import createErrorBuilder, {
  validateArray,
  validateArrayMinLength,
  validateExistence,
  validateTranslations,
} from '../form/createErrorBuilder';
import {
  getKielivalinta,
  validateIfJulkaistu,
  validateOptionalTranslatedField,
  validateRelations,
  validateValintakokeet,
} from '../form/formConfigUtils';

const validateValintatavat = _fp.flow(
  validateIfJulkaistu(
    validateArrayMinLength('valintatavat', 1, {
      isFieldArray: true,
    }),
    validateArray(
      'valintatavat',
      _fp.flow(validateExistence('tapa'), validateTranslations('nimi'))
    )
  )
);

export const validateValintaperusteForm = (values, registeredFields) => {
  const kieliversiot = getKielivalinta(values);
  return _fp
    .flow(
      validateExistence('tila'),
      validateExistence('perustiedot.tyyppi'),
      validateArrayMinLength('perustiedot.kieliversiot', 1),
      validateIfJulkaistu(validateExistence('perustiedot.hakutapa')),
      validateIfJulkaistu(validateExistence('perustiedot.kohdejoukko')),
      validateTranslations('kuvaus.nimi'),
      validateOptionalTranslatedField('kuvaus.kuvaus'),
      validateIfJulkaistu(validateValintakokeet),
      validateValintatavat,
      validateRelations([
        {
          key: 'soraKuvaus',
          t: 'yleiset.soraKuvaus',
        },
      ])
    )(createErrorBuilder(values, kieliversiot, registeredFields))
    .getErrors();
};
