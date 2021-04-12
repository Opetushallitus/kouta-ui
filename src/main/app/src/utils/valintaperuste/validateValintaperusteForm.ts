import _fp from 'lodash/fp';

import createErrorBuilder, {
  validateArray,
  validateArrayMinLength,
  validateExistence,
  validateTranslations,
} from '../form/createErrorBuilder';
import {
  getKielivalinta,
  validateIf,
  validateIfJulkaistu,
  validateOptionalTranslatedField,
  validateRelations,
} from '../form/formConfigUtils';
import { koulutustyypitWithValintatapa } from './constants';

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

export const validateValintaperusteForm = values => {
  const koulutustyyppi = values?.perustiedot?.tyyppi;
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
      validateIf(
        koulutustyypitWithValintatapa.some(v => v === koulutustyyppi),
        validateValintatavat
      ),
      validateRelations([
        {
          key: 'soraKuvaus',
          t: 'yleiset.soraKuvaus',
        },
      ])
    )(createErrorBuilder(values, kieliversiot))
    .getErrors();
};
