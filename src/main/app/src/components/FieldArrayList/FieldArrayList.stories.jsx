import React from 'react';

import { storiesOf } from '@storybook/react';
import { reduxForm, Field, FieldArray } from 'redux-form';

import Button from '#/src/components/Button';
import { FormFieldInput } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';

import FieldArrayList from './index';

const StoryForm = reduxForm({
  form: 'storyForm',
})(({ children }) => <form children={children} />);

const StoryFieldArrayList = ({ fields }) => (
  <>
    <FieldArrayList fields={fields}>
      {({ field }) => (
        <>
          <Box marginBottom={2}>
            <Field
              name={`${field}.name`}
              component={FormFieldInput}
              label="Nimi"
            />
          </Box>
          <Field name={`${field}.age`} component={FormFieldInput} label="Ikä" />
        </>
      )}
    </FieldArrayList>
    <Box
      display="flex"
      justifyContent="center"
      marginTop={fields.length > 0 ? 4 : 0}
    >
      <Button type="button" variant="outlined" onClick={() => fields.push({})}>
        Lisää henkilö
      </Button>
    </Box>
  </>
);

storiesOf('FieldArrayList', module).add('Basic', () => (
  <StoryForm>
    <FieldArray name="fields" component={StoryFieldArrayList} />
  </StoryForm>
));
