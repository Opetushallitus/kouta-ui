import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import LanguageSelector from '../LanguageSelector';
import Textarea from '../Textarea';
import useTranslation from '../useTranslation';

const renderTextareaField = ({ input }) => <Textarea {...input} />;

const KuvausSection = ({ languages }) => {
  const { t } = useTranslation();

  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: language }) => {
        return (
          <>
            <Typography variant="h6" marginBottom={1}>
              {t('yleiset.kuvaus')}
            </Typography>
            <Field
              name={`kuvaus.${language}`}
              component={renderTextareaField}
            />
          </>
        );
      }}
    </LanguageSelector>
  );
};

export default KuvausSection;
