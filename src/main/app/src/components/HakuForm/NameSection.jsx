import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import LanguageSelector from '../LanguageSelector';
import Input from '../Input'

const renderInputField = ({ input}) => {
  const { onChange, value } = input;
  return (
    <Input onChange={onChange} value={value} />
  );
};

const NameSection = ({ languages, ...props }) => {
  return (
    <div {...props}>
      <LanguageSelector languages={languages} defaultValue="fi">
        {({ value }) => {
          return (
            <>
              <div style={{'maxWidth': '510px'}}>
                <Typography variant="h6" marginBottom={1}>
                  Anna haulle nimi
                </Typography>
                <Field name="name" component={renderInputField} />
                <Typography variant="h6" marginTop={1.375} style={{'color': '#1e7998'}}>
                  Huom! Tämä teksti näkyy oppijalle Opintopolun sivuilla
                </Typography>
              </div>
            </>
          );
        }}
      </LanguageSelector>
    </div>
  );
};

export default NameSection;
