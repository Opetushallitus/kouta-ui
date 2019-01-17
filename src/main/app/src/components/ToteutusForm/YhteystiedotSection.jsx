import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import LanguageSelector from '../LanguageSelector';
import Input from '../Input';
import Spacing from '../Spacing';

const renderInputField = ({ input, type = 'text' }) => (
  <Input {...input} type={type} />
);

const YhteystiedotSection = ({ languages }) => {
  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value }) => {
        return (
          <>
            <Spacing marginBottom={2}>
              <Typography variant="h6" marginBottom={1}>
                Nimi
              </Typography>
              <Field name="name" component={renderInputField} />
            </Spacing>
            <Spacing marginBottom={2}>
              <Typography variant="h6" marginBottom={1}>
                Titteli
              </Typography>
              <Field name="title" component={renderInputField} />
            </Spacing>
            <Spacing marginBottom={2}>
              <Typography variant="h6" marginBottom={1}>
                Sähköposti
              </Typography>
              <Field name="email" type="email" component={renderInputField} />
            </Spacing>
            <Spacing marginBottom={2}>
              <Typography variant="h6" marginBottom={1}>
                Puhelin
              </Typography>
              <Field name="phone" component={renderInputField} />
            </Spacing>
            <Spacing>
              <Typography variant="h6" marginBottom={1}>
                Verkkosivut
              </Typography>
              <Field name="website" type="url" component={renderInputField} />
            </Spacing>
          </>
        );
      }}
    </LanguageSelector>
  );
};

export default YhteystiedotSection;
