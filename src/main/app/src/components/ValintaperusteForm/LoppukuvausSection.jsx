import React from 'react';
import { Field } from 'redux-form';

import Editor from '../Editor';
import LanguageSelector from '../LanguageSelector';
import Typography from '../Typography';

const renderEditorField = ({ input }) => <Editor {...input} />;

const LoppukuvausSection = ({ languages }) => {
  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: language }) => (
        <>
          <Typography variant="h6" marginBottom={1}>
            Kuvaus
          </Typography>
          <Field
            name={`kuvaus.${language}`}
            component={renderEditorField}
          />
        </>
      )}
    </LanguageSelector>
  );
};

export default LoppukuvausSection;
