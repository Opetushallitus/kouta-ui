import React, { createElement } from 'react';
import { isArray, isNil } from 'lodash';
import { useTranslation } from 'react-i18next';
import FormControl from '../FormControl';

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
