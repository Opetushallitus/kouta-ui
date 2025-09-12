import React from 'react';

import _ from 'lodash';

import FormHelperTextMulti from '#/src/components/FormHelperTextMulti';
import { FIELD_ERROR_CLASSNAME } from '#/src/constants';
import { useSubmitErrors } from '#/src/hooks/form';
import { getFieldNameWithoutLanguage } from '#/src/utils';

export const ErrorPlaceholder = props => {
  const { name } = props;
  const errors = useSubmitErrors();
  const error = _.get(errors, name);
  const isError = !_.isNil(error);

  return (
    <div
      className={isError ? FIELD_ERROR_CLASSNAME : ''}
      data-test-id={`form-control_${getFieldNameWithoutLanguage(name)}`}
    >
      <FormHelperTextMulti errorMessage={error} />
    </div>
  );
};
