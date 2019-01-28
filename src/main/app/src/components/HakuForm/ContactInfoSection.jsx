import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import LanguageSelector from '../LanguageSelector';
import Input from '../Input'
import Checkbox from '../Checkbox';

const renderInputField = ({ input, placeholder}) => {
  const { onChange, value } = input;
  return (
    <Input placeholder={placeholder} onChange={onChange} value={value} />
  );
};

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
        {({ value }) => {
          return (
            <>
            <div style={{'maxWidth': '510px'}}>
              <Typography variant="h6" marginTop={1} marginBottom={0.25}>
                Nimi
              </Typography>
              <Field name="name" component={renderInputField} placeholder="Kaija Koulutus" />
              <Typography variant="h6" marginTop={1} marginBottom={0.25}>
                Titteli
              </Typography>
              <Field name="title" component={renderInputField} placeholder="Opinto-ohjaaja" />
              <Typography variant="h6" marginTop={1} marginBottom={0.25}>
                Sähköposti
              </Typography>
              <Field name="email" component={renderInputField} placeholder="etunimi.sukunimi@salpaus.fi" />
              <Typography variant="h6" marginTop={1} marginBottom={0.25}>
                Puhelin
              </Typography>
              <Field name="phone" component={renderInputField} placeholder="050 XXX XXXX" />
              <div style={{'marginTop': '21px'}}>
                <Field name="fi" component={renderCheckboxField} />
              </div>
            </div>
            </>
          );
        }}
      </LanguageSelector>
    </div>
  );
};

export default ContactInfoSection;
