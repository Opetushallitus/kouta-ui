import React from 'react';

export const FormControl = ({
  disabled = false,
  error = false,
  children,
  ...props
}) => {
  const childrenProps = { disabled, error };

  return React.Children.map(children, child => {
    return React.isValidElement(child)
      ? React.cloneElement(child, childrenProps)
      : child;
  });
};

export default FormControl;
