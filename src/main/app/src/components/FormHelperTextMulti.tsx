import React from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { FormHelperText } from '#/src/components/virkailija';
import { otherwise } from '#/src/utils';

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
        errors.map((e, index) => (
          <FormHelperText key={index} error>
            {_.cond([
              [_.isFunction, f => f(t)],
              [otherwise, t],
            ])(e)}
          </FormHelperText>
        ))}
    </>
  );
};

export default FormHelperTextMulti;
