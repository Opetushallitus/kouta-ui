import React from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { FormHelperText } from '#/src/components/virkailija';

/**
 * Wrapper for FormHelperText able to display one helpertext and multiple error messages
 */
export const FormHelperTextMulti = ({ errorMessage = [], helperText = '' }) => {
  const { t } = useTranslation();
  const errors = errorMessage ? _.castArray(errorMessage) : [];
  return (
    <>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      {errors &&
        errors.filter(_.identity).map(e => (
          <FormHelperText key={_.uniqueId('FormHelperText_')} error>
            {match(e)
              .when(_.isFunction, f => f(t))
              .otherwise(t)}
          </FormHelperText>
        ))}
    </>
  );
};

export default FormHelperTextMulti;
