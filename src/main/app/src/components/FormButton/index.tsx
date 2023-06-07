import React from 'react';

import { useFormIsDisabled } from '#/src/contexts/FormContext';

import Button from '../Button';

export const FormButton = props => {
  const disabled = useFormIsDisabled();

  return <Button {...props} disabled={disabled} />;
};

export default FormButton;
