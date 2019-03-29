import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import Input from '../Input';
import LanguageSelector from '../LanguageSelector';
import useTranslation from '../useTranslation';

const renderInputField = ({ input }) => <Input {...input} />;

const NimiSection = ({ languages }) => {
  const { t } = useTranslation();

  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: activeLanguage }) => (
        <>
          <Typography variant="h6" marginBottom={1}>
            {t('yleiset.nimi')}
          </Typography>
          <Field name={`nimi.${activeLanguage}`} component={renderInputField} />
        </>
      )}
    </LanguageSelector>
  );
};

export default NimiSection;
