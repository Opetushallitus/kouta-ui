import React from 'react';

import { get, isNil } from 'lodash-es';

import FormHelperTextMulti from '#/src/components/FormHelperTextMulti';
import { FIELD_ERROR_CLASSNAME } from '#/src/constants';
import { useSubmitErrors } from '#/src/hooks/form';
import { getFieldNameWithoutLanguage } from '#/src/utils';

export const ErrorPlaceholder = props => {
  const { name } = props;
  const errors = useSubmitErrors();
  const error = get(errors, name);
  const isError = !isNil(error);

  return (
    <div
      className={isError ? FIELD_ERROR_CLASSNAME : ''}
      data-test-id={`form-control_${getFieldNameWithoutLanguage(name)}`}
    >
      <FormHelperTextMulti errorMessage={error} />
    </div>
  );
};
