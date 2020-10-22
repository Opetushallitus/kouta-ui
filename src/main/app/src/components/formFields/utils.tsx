import React, { createElement } from 'react';
import _ from 'lodash';
import { FormControl, FormLabel } from '#/src/components/virkailija';
import {
  useFieldConfig,
  useFieldIsRequired,
} from '#/src/hooks/fieldConfigHooks';
import FormHelperTextMulti from '#/src/components/FormHelperTextMulti';
import { useFormConfig } from '#/src/hooks/form';
import { simpleMapProps } from '#/src/components/formFields';

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
          <FormLabel error={error} disabled={disabled} mb={1} id={labelId}>
            {`${label}${required ? ' *' : ''}`}
          </FormLabel>
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
