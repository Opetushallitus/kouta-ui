import { AxiosResponse } from 'axios';
import { get, isNil, isString, set, uniq } from 'lodash-es';

import { ENTITY } from '#/src/constants';
import { KoutaErrorData, KoutaErrorResponse } from '#/src/types/formTypes';
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
  errors: Record<string, unknown>,
  remoteError: KoutaErrorResponse,
  fieldName: string,
  errorKey = `validointivirheet.${remoteError?.errorType}`
) => {
  const existingError = get(errors, fieldName);

  let val: unknown;

  if (isNil(existingError)) {
    val = [errorKey];
  } else if (Array.isArray(existingError)) {
    val = uniq([...existingError, errorKey]);
  } else {
    val = uniq([existingError, errorKey]);
  }

  set(errors, fieldName, val);
  return errors;
};

export const withRemoteErrors = (
  formName: ENTITY,
  response: AxiosResponse | undefined,
  errors: Record<string, unknown> = {},
  formValues: KoutaErrorData = {}
) => {
  const errorConverter = REMOTE_ERRORS_TO_FORM_ERRORS[formName];
  // Kaikki lomakkeet käyttävät useSaveFormia, mutta kaikille ei ole toteutettuna converteria
  if (!errorConverter) {
    return errors;
  }

  const resData: Array<KoutaErrorResponse> | undefined = response?.data;
  resData?.forEach?.(remoteError => {
    const formError = errorConverter?.(remoteError, formValues);

    // formError merkkijonona on vain lomakkeen kentän nimi. Virheavain päätellään backend-virheen errorType-kentästä.
    if (isString(formError)) {
      setErrors(errors, remoteError, formError);
    } else if (Array.isArray(formError)) {
      formError.forEach(({ field, errorKey }) => {
        setErrors(errors, remoteError, field, errorKey);
      });
    } else if (formError?.field) {
      setErrors(errors, remoteError, formError?.field, formError?.errorKey);
    }
  });
  return errors;
};
