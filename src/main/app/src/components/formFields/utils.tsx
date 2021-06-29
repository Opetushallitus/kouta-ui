import React, { createElement } from 'react';

import _ from 'lodash';

import { simpleMapProps } from '#/src/components/formFields';
import FormHelperTextMulti from '#/src/components/FormHelperTextMulti';
import { FormControl, FormLabel } from '#/src/components/virkailija';
import { FIELD_ERROR_CLASSNAME } from '#/src/constants';
import { useFormIsDisabled } from '#/src/contexts/FormContext';

export const createComponent = (Component, mapProps = simpleMapProps) => {
  const InputComponent = props => {
    const {
      disabled,
      label = '',
      helperText,
      meta,
      required,
      input: { name },
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
        required: undefined,
      })
    );

    const readOnly = useFormIsDisabled();

    return (
      <div className={isError ? FIELD_ERROR_CLASSNAME : ''}>
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
      </div>
    );
  };

  InputComponent.displayName = `FormField${Component.name}`;

  return InputComponent;
};
