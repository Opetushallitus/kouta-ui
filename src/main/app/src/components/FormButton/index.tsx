import React from 'react';

import { Button } from '#/src/components/virkailija';
import { useFormIsDisabled } from '#/src/contexts/FormContext';

export const FormButton = props => {
  const disabled = useFormIsDisabled() && !props?.isHakokohteenLiittaja;
  return <Button {...props} disabled={props.disabled || disabled} />;
};

export default FormButton;
