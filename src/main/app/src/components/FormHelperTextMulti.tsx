import { castArray, identity, isFunction, uniqueId } from 'lodash';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { FormHelperText } from '#/src/components/virkailija';

/**
 * Wrapper for FormHelperText able to display one helpertext and multiple error messages
 */
export const FormHelperTextMulti = ({
  errorMessage = [],
  helperText = '',
}: {
  errorMessage?:
    | string
    | Array<string>
    | ((t: (key: string) => string) => string | Array<string>);
  helperText?: string;
}) => {
  const { t } = useTranslation();
  const errors = errorMessage ? castArray(errorMessage) : [];
  return (
    <>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      {errors &&
        errors.filter(identity).map(e => (
          <FormHelperText key={uniqueId('FormHelperText_')} error>
            {match(e)
              .when(isFunction, f => f(t))
              .otherwise(t)}
          </FormHelperText>
        ))}
    </>
  );
};

export default FormHelperTextMulti;
