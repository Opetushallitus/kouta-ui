import React, { Fragment } from 'react';
import { FieldArray, Field } from 'redux-form';

import Button from '../Button';
import Spacing from '../Spacing';
import Typography from '../Typography';
import Divider from '../Divider';
import Flex from '../Flex';
import Input from '../Input';
import Textarea from '../Textarea';

const renderInputField = ({ input }) => <Input {...input} />;

const renderTextareaField = ({ input }) => <Textarea {...input} />;

const renderOsaamisalatFields = ({ fields, language }) => (
  <>
    {fields.map((field, index) => (
      <Fragment key={index}>
        <Spacing marginBottom={2}>
          <Typography variant="h6" marginBottom={1}>
            Nimi
          </Typography>

          <Field name={`${field}.nimi.${language}`} component={renderInputField} />
        </Spacing>

        <Spacing marginBottom={2}>
          <Typography variant="h6" marginBottom={1}>
            Kuvaus
          </Typography>

          <Field name={`${field}.kuvaus.${language}`} component={renderTextareaField} />
        </Spacing>
        <Spacing marginBottom={2}>
          <Typography variant="h6" marginBottom={1}>
            Linkki
          </Typography>

          <Field name={`${field}.linkki.${language}`} component={renderInputField} />
        </Spacing>
        <Spacing marginBottom={2}>
          <Typography variant="h6" marginBottom={1}>
            Linkin otsikko
          </Typography>

          <Field name={`${field}.otsikko.${language}`} component={renderInputField} />
        </Spacing>
        <Flex justifyEnd>
          <Button
            type="button"
            onClick={() => {
              fields.remove(index);
            }}
            variant="outlined"
            color="secondary"
          >
            Poista
          </Button>
        </Flex>
        <Divider marginTop={3} marginBottom={3} />
      </Fragment>
    ))}
    <Button
      type="button"
      onClick={() => {
        fields.push({});
      }}
    >
      Lisää osaamisala
    </Button>
  </>
);

const KorkeakouluOsaamisalatFields = ({ name, language }) => {
  return <FieldArray name={name} component={renderOsaamisalatFields} language={language} />;
};

export default KorkeakouluOsaamisalatFields;
