import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import Textarea from '../Textarea';
import LanguageSelector from '../LanguageSelector';

const renderTextarea = ({ input }) => <Textarea {...input} />;

const DescriptionSection = ({ languages, ...props }) => {
  return (
    <div {...props}>
      <LanguageSelector languages={languages} defaultValue="fi">
        {({ value }) => {
          return (
            <>
              <Typography variant="h6" marginBottom={1}>
                Koulutuksen kuvaus
              </Typography>
              <Field name={`description.${value}`} component={renderTextarea} />
            </>
          );
        }}
      </LanguageSelector>
    </div>
  );
};

export default DescriptionSection;
