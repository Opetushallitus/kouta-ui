import React from 'react';
import { Field } from 'redux-form';

import Input from '../../Input';
import Textarea from '../../Textarea';
import Typography from '../../Typography';
import Spacing from '../../Spacing';

const renderInputField = ({ input }) => <Input {...input} />;

const renderTextareaField = ({ input }) => <Textarea {...input} />;

export const KorkeakouluKuvausSection = ({ language }) => (
  <>
    <Spacing marginBottom={2}>
      <Typography variant="h6" marginBottom={1}>
        Kuvauksen nimi
      </Typography>
      <Field name={`nimi.${language}`} component={renderInputField} />
    </Spacing>
    <Typography variant="h6" marginBottom={1}>
      Kuvaus
    </Typography>
    <Field name={`kuvaus.${language}`} component={renderTextareaField} />
  </>
);

export default KorkeakouluKuvausSection;
