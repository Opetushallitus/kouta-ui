import React, { createElement } from 'react';
import FormControl from '../FormControl';
import useTranslation from '../useTranslation';
import { isArray } from '../../utils';

export const createComponent = (Component, mapProps) => {
  const InputComponent = props => {
    const { t } = useTranslation();

    const { disabled, label, helperText, meta } = props;
    const hasError = !!meta.error;
    const showError = hasError;
    const children = createElement(Component, mapProps(props));

    return (
      <div className={showError ? '__formFieldError__' : ''}>
        <FormControl
          error={showError}
          helperText={
            showError
              ? isArray(meta.error)
                ? t(...meta.error)
                : t(meta.error)
              : helperText
          }
          label={label}
          disabled={disabled}
        >
          {children}
        </FormControl>
      </div>
    );
  };

  InputComponent.displayName = `FormField${Component.name}`;

  return InputComponent;
};
