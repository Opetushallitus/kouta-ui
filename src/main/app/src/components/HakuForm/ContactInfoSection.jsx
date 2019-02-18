import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import LanguageSelector from '../LanguageSelector';
import Input from '../Input'

const renderInputField = ({ input, placeholder }) => <Input placeholder={placeholder} {...input} />;

const ContactInfoSection = ({ languages, koodiUri, ...props }) => {
  return (
    <div {...props}>
      <LanguageSelector languages={languages} defaultValue="fi">
        {({ value: activeLanguage }) => {
          return (
            <>
            <div>
              <Typography variant="h6" marginTop={1} marginBottom={0.25}>
                Nimi
              </Typography>
              <Field name={`nimi.${activeLanguage}`} 
                      component={renderInputField} 
                      />
              <Typography variant="h6" marginTop={1} marginBottom={0.25}>
                Titteli
              </Typography>
              <Field name={`titteli.${activeLanguage}`} 
                     component={renderInputField}
                     />
              <Typography variant="h6" marginTop={1} marginBottom={0.25}>
                Sähköposti
              </Typography>
              <Field name={`email.${activeLanguage}`}
                     component={renderInputField}
                     />
              <Typography variant="h6" marginTop={1} marginBottom={0.25}>
                Puhelin
              </Typography>
              <Field name={`puhelin.${activeLanguage}`}
                     component={renderInputField}
                     />
            </div>
            </>
          );
        }}
      </LanguageSelector>
    </div>
  );
};

export default ContactInfoSection;
