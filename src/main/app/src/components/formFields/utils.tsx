import React, { createElement } from 'react';
import _ from 'lodash';
import FormControl from '#/src/components/FormControl';
import {
  useFieldConfig,
  useFieldIsRequired,
} from '#/src/hooks/fieldConfigHooks';
import FormHelperTextMulti from '#/src/components/FormHelperTextMulti';
import { useFormConfig } from '#/src/hooks/form';

export const createComponent = (Component, mapProps) => {
  const InputComponent = props => {
    const {
      disabled,
      label = '',
      helperText,
      meta,
      input: { name },
      configurable = true,
    } = props;

    const { error } = meta;
    const isError = !_.isNil(error);
    const children = createElement(Component, mapProps(props));

    const fieldConfig = useFieldConfig(name);
    const { readOnly } = useFormConfig();
    const required = useFieldIsRequired(fieldConfig);

    return fieldConfig || !configurable ? (
      <FormControl
        error={isError}
        helperText={
          <FormHelperTextMulti errorMessage={error} helperText={helperText} />
        }
        label={`${label}${required ? ' *' : ''}`}
        disabled={disabled || readOnly}
      >
        {children}
      </FormControl>
    ) : (
      <></>
    );
  };

  InputComponent.displayName = `FormField${Component.name}`;

  return InputComponent;
};
