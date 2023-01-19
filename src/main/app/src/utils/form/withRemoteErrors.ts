import { AxiosResponse } from 'axios';
import _ from 'lodash';

import { ENTITY } from '#/src/constants';
import { hakuRemoteErrorsToFormErrors } from '#/src/utils/haku/hakuRemoteErrorsToFormErrors';
import { hakukohdeRemoteErrorsToFormErrors } from '#/src/utils/hakukohde/hakukohdeRemoteErrorsToFormErrors';
import { koulutusRemoteErrorsToFormErrors } from '#/src/utils/koulutus/koulutusRemoteErrorsToFormErrors';
import { sorakuvausRemoteErrorsToFormErrors } from '#/src/utils/soraKuvaus/sorakuvausRemoteErrorsToFormErrors';
import { toteutusRemoteErrorsToFormErrors } from '#/src/utils/toteutus/toteutusRemoteErrorsToFormErrors';
import { valintaperusteRemoteErrorsToFormErrors } from '#/src/utils/valintaperuste/valintaperusteRemoteErrorsToFormErrors';

const REMOTE_ERRORS_TO_FORM_ERRORS = {
  [ENTITY.KOULUTUS]: koulutusRemoteErrorsToFormErrors,
  [ENTITY.TOTEUTUS]: toteutusRemoteErrorsToFormErrors,
  [ENTITY.HAKUKOHDE]: hakukohdeRemoteErrorsToFormErrors,
  [ENTITY.HAKU]: hakuRemoteErrorsToFormErrors,
  [ENTITY.VALINTAPERUSTE]: valintaperusteRemoteErrorsToFormErrors,
  [ENTITY.SORA_KUVAUS]: sorakuvausRemoteErrorsToFormErrors,
};

const setErrors = (
  errors,
  remoteError,
  fieldName,
  errorKey = `validointivirheet.${remoteError?.errorType}`
) => {
  const existingError = _.get(errors, fieldName);

  let val = existingError;

  if (_.isNil(existingError)) {
    val = [errorKey];
  } else if (_.isArray(existingError)) {
    val = [...existingError, errorKey];
  } else {
    val = [existingError, errorKey];
  }

  _.set(errors, fieldName, val);
  return errors;
};

export const withRemoteErrors = (
  formName: ENTITY,
  response: AxiosResponse,
  errors = {},
  formValues = {}
) => {
  const errorConverter = REMOTE_ERRORS_TO_FORM_ERRORS[formName];
  // Kaikki lomakkeet käyttävät useSaveFormia, mutta kaikille ei ole toteutettuna converteria
  if (!errorConverter) {
    return errors;
  }

  const resData = response?.data;
  resData?.forEach?.(remoteError => {
    const formError = errorConverter?.(remoteError, formValues);

    // formError merkkijonona on vain lomakkeen kentän nimi. Virheavain päätellään backend-virheen errorType-kentästä.
    if (_.isString(formError)) {
      setErrors(errors, remoteError, formError);
    } else if (_.isArray(formError)) {
      formError.forEach(({ field, errorKey }) => {
        setErrors(errors, remoteError, field, errorKey);
      });
    } else if (formError?.field) {
      setErrors(errors, remoteError, formError?.field, formError?.errorKey);
    }
  });
  return errors;
};
