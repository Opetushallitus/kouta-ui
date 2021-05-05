import { AxiosResponse } from 'axios';
import _ from 'lodash';

import { koulutusRemoteErrorsToFormErrors } from '#/src/utils/koulutus/koulutusRemoteErrorsToFormErrors';

const REMOTE_ERRORS_TO_FORM_ERRORS = {
  koulutusForm: koulutusRemoteErrorsToFormErrors,
};

const setErrors = (
  errors,
  remoteError,
  fieldName,
  errorKey = `validointivirheet.${remoteError?.errorType}`
) => {
  const existingError = _.get(errors, fieldName);

  let val = existingError;

  if (errorKey) {
    if (_.isNil(existingError)) {
      val = [errorKey];
    } else if (_.isArray(existingError)) {
      val = [...existingError, errorKey];
    } else {
      val = [existingError, errorKey];
    }
  }

  _.set(errors, fieldName, val);
  return errors;
};

export const withRemoteErrors = (
  formName: string,
  response: AxiosResponse,
  errors = {}
) => {
  const resData = response?.data;
  resData?.forEach?.(remoteError => {
    const errorConverter =
      REMOTE_ERRORS_TO_FORM_ERRORS[formName]?.[remoteError?.path];

    const formError = _.isFunction(errorConverter)
      ? errorConverter(remoteError)
      : errorConverter;

    // formError merkkojonona on vain lomakkeen kentän nimi. Virheavain päätellään backend-virheen errorType-kentästä.
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
