import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import Input from '../Input';
import Spacing from '../Spacing';
import LanguageSelector from '../LanguageSelector';
import Checkbox from '../Checkbox';

const renderCheckboxField = ({ input, label = null }) => (
  <Checkbox checked={input.value} onChange={input.onChange} children={label} />
);

const renderInputField = ({ input }) => <Input {...input} />;

const PerustiedotSection = ({ languages }) => {
  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: activeLanguage }) => (
        <>
          <Spacing marginBottom={2}>
            <Typography variant="h6" marginBottom={1}>
              Anna hakukohteelle nimi
            </Typography>
            <Field name={`nimi.${activeLanguage}`} component={renderInputField} />
          </Spacing>
          <Field
            name="voiSuorittaaKaksoistutkinnon"
            component={renderCheckboxField}
            label="Voi suorittaa kaksoistutkinnon"
          />
        </>
      )}
    </LanguageSelector>
  );
};

export default PerustiedotSection;
