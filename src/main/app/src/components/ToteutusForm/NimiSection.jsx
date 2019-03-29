import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import LanguageSelector from '../LanguageSelector';
import Input from '../Input';
import useTranslation from '../useTranslation';

const renderInputField = ({ input, type = 'text' }) => (
  <Input {...input} type={type} />
);

const NimiSection = ({ languages }) => {
  const { t } = useTranslation();

  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: activeLanguage }) => {
        return (
          <>
            <Typography variant="h6" marginBottom={1}>
              {t('yleiset.nimi')}
            </Typography>
            <Field
              name={`name.${activeLanguage}`}
              component={renderInputField}
            />
          </>
        );
      }}
    </LanguageSelector>
  );
};

export default NimiSection;
