import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import LanguageSelector from '../LanguageSelector';
import Input from '../Input';
import useTranslation from '../useTranslation';

const renderInputField = ({ input }) => <Input {...input} />;

const NameSection = ({ languages, ...props }) => {
  const { t } = useTranslation();

  return (
    <div {...props}>
      <LanguageSelector languages={languages} defaultValue="fi">
        {({ value: activeLanguage }) => {
          return (
            <>
              <Typography variant="h6" marginBottom={1}>
                {t('yleiset.nimi')}
              </Typography>
              <Field
                name={`nimi.${activeLanguage}`}
                component={renderInputField}
              />
            </>
          );
        }}
      </LanguageSelector>
    </div>
  );
};

export default NameSection;
