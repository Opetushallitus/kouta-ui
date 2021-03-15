import React, { createElement } from 'react';

import _ from 'lodash';

import { simpleMapProps } from '#/src/components/formFields';
import FormHelperTextMulti from '#/src/components/FormHelperTextMulti';
import { FormControl, FormLabel } from '#/src/components/virkailija';
import {
  useFieldConfig,
  useFieldIsRequired,
} from '#/src/hooks/fieldConfigHooks';
import { useFormConfig } from '#/src/hooks/form';

export const createComponent = (Component, mapProps = simpleMapProps) => {
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
    const labelId = `FormLabel_${name}`;
    const children = createElement(
      Component,
      mapProps({
        ...props,
        ariaLabelledBy: labelId,
        input: { ...props.input, ariaLabelledBy: labelId },
      })
    );

    const fieldConfig = useFieldConfig(name);
    const { readOnly } = useFormConfig();
    const required = useFieldIsRequired(fieldConfig);

    return fieldConfig || !configurable ? (
      <FormControl
        error={isError}
        helperText={
          <FormHelperTextMulti errorMessage={error} helperText={helperText} />
        }
        label={
          label ? (
            <FormLabel error={error} disabled={disabled} mb={1} id={labelId}>
              {`${label}${required ? ' *' : ''}`}
            </FormLabel>
          ) : undefined
        }
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
