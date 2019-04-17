import React, { createElement } from 'react';
import FormControl from '../FormControl';
import FormLabel from '../FormLabel';
import FormHelperText from '../FormHelperText';

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
  class InputComponent extends React.Component {
    constructor() {
      super();

      this.genId = generateId('FormField');
    }

    render() {
      const { disabled, label, helperText, meta } = this.props;
      const hasError = !!meta.error;
      const showError = hasError;
      const id = this.props.id || this.genId;

      const children = createElement(
        Component,
        mapProps({ id, ...this.props }),
      );

      return (
        <FieldFormGroup
          error={showError}
          helperText={showError ? meta.error : helperText}
          label={label}
          disabled={disabled}
          id={id}
        >
          {children}
        </FieldFormGroup>
      );
    }
  }

  InputComponent.displayName = `FormField${Component.name}`;

  return InputComponent;
};
