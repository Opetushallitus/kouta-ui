import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import Input from '../Input';

const renderInputField = ({ input, ...props }) => (
  <Input {...input} {...props} />
);

const AloituspaikatSection = () => {
  return (
    <>
      <Typography variant="h6" marginBottom={1}>
        Anna aloituspaikkojen lukumäärä
      </Typography>
      <Field
        name="aloituspaikkamaara"
        component={renderInputField}
        type="number"
      />
    </>
  );
};

export default AloituspaikatSection;
