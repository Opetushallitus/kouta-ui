import React from 'react';
import { Field } from 'redux-form';

import Editor from '../Editor';
import LanguageSelector from '../LanguageSelector';
import Typography from '../Typography';
import useTranslation from '../useTranslation';

const renderEditorField = ({ input }) => <Editor {...input} />;

const LoppukuvausSection = ({ languages }) => {
  const { t } = useTranslation();

  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: language }) => (
        <>
          <Typography variant="h6" marginBottom={1}>
            {t('yleiset.kuvaus')}
          </Typography>
          <Field name={`kuvaus.${language}`} component={renderEditorField} />
        </>
      )}
    </LanguageSelector>
  );
};

export default LoppukuvausSection;
