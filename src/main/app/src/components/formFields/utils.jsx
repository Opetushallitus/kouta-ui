import React, { createElement } from 'react';
import { isArray, isNil } from 'lodash';
import FormControl from '../FormControl';
import useTranslation from '../useTranslation';

export const createComponent = (Component, mapProps) => {
  const InputComponent = props => {
    const {
      disabled,
      label,
      helperText,
      meta: { error },
    } = props;

    const { t } = useTranslation();
    const children = createElement(Component, mapProps(props));

    return (
      <FormControl
        error={!isNil(error)}
        helperText={
          error ? (isArray(error) ? t(...error) : t(error)) : helperText
        }
        label={label}
        disabled={disabled}
      >
        {children}
      </FormControl>
    );
  };

  InputComponent.displayName = `FormField${Component.name}`;

  return InputComponent;
};
