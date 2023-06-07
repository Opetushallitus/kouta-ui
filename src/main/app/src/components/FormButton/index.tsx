import React from 'react';

import { Button } from '#/src/components/virkailija';
import { useFormIsDisabled } from '#/src/contexts/FormContext';

export const FormButton = props => {
  const disabled = useFormIsDisabled();

  return <Button {...props} disabled={disabled} />;
};

export default FormButton;
