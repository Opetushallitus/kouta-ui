import React from 'react';

import { reduxForm, Field, FieldArray } from 'redux-form';

import { FormButton } from '#/src/components/FormButton';
import { FormFieldInput } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';

import FieldArrayList from './index';

const StoryForm = reduxForm({
  form: 'storyForm',
})(({ children }) => <form>{children}</form>);

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
      <FormButton
        type="button"
        variant="outlined"
        onClick={() => fields.push({})}
      >
        Lisää henkilö
      </FormButton>
    </Box>
  </>
);

export default {
  title: 'FieldArrayList',
};

export const Basic = () => (
  <StoryForm>
    <FieldArray name="fields" component={StoryFieldArrayList} />
  </StoryForm>
);
