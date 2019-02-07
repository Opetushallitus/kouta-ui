import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import LanguageSelector from '../LanguageSelector';
import Input from '../Input'
import Checkbox from '../Checkbox';
import Spacing from '../Spacing';

const renderInputField = ({ input, placeholder }) => <Input placeholder={placeholder} {...input} />;

const renderCheckboxField = ({ input }) => {
  const { onChange, value } = input;

  return (
    <Checkbox style={{'fontSize': '20px'}} onChange={onChange} checked={value}>
       Käytä samoja valintoja kaikissa kieliversioissa
    </Checkbox>
  );
};

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
              <Field name={`nimi.${activeLanguage}`} component={renderInputField} placeholder="Kaija Koulutus" />
              <Typography variant="h6" marginTop={1} marginBottom={0.25}>
                Titteli
              </Typography>
              <Field name={`titteli.${activeLanguage}`} component={renderInputField} placeholder="Opinto-ohjaaja" />
              <Typography variant="h6" marginTop={1} marginBottom={0.25}>
                Sähköposti
              </Typography>
              <Field name={`email.${activeLanguage}`} component={renderInputField} placeholder="etunimi.sukunimi@salpaus.fi" />
              <Typography variant="h6" marginTop={1} marginBottom={0.25}>
                Puhelin
              </Typography>
              <Field name={`puhelin.${activeLanguage}`} component={renderInputField} placeholder="050 XXX XXXX" />
              <Spacing marginTop={3}>
                <Field name="fi" component={renderCheckboxField} />
              </Spacing>
            </div>
            </>
          );
        }}
      </LanguageSelector>
    </div>
  );
};

export default ContactInfoSection;
