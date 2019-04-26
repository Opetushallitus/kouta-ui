import React, { createElement, useRef } from 'react';
import FormControl from '../FormControl';
import FormLabel from '../FormLabel';
import FormHelperText from '../FormHelperText';
import useTranslation from '../useTranslation';
import { isArray } from '../../utils';

const generateId = prefix =>
  `${prefix}__${Math.round(Math.random() * 100000).toString()}`;

const FieldFormGroup = ({
  label,
  helperText = null,
  children = null,
  id,
  ...props
}) => {
  return (
    <FormControl {...props}>
      {label ? <FormLabel {...id && { htmlFor: id }}>{label}</FormLabel> : null}
      {children}
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
};

export const createComponent = (Component, mapProps) => {
  const InputComponent = props => {
    const idRef = useRef();
    const { t } = useTranslation();

    if (!idRef.current) {
      idRef.current = generateId('FormField');
    }

    const { disabled, label, helperText, meta } = props;
    const hasError = !!meta.error;
    const showError = hasError;
    const id = props.id || idRef.current;

    const children = createElement(Component, mapProps({ id, ...props }));

    return (
      <FieldFormGroup
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
        id={id}
      >
        {children}
      </FieldFormGroup>
    );
  };

  InputComponent.displayName = `FormField${Component.name}`;

  return InputComponent;
};
