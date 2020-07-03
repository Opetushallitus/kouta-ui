import React from 'react';
import { storiesOf } from '@storybook/react';
import { reduxForm, Field, FieldArray } from 'redux-form';

import { FormFieldInput } from '#/src/components/formFields';
import Button from '#/src/components/Button';
import Spacing from '#/src/components/Spacing';
import Flex from '#/src/components/Flex';
import FieldArrayList from './index';

import {
  makeStoreDecorator,
  makeLocalizationDecorator,
} from '#/src/storybookUtils';

const StoryForm = reduxForm({
  form: 'storyForm',
})(({ children }) => <form children={children} />);

const StoryFieldArrayList = ({ fields }) => (
  <>
    <FieldArrayList fields={fields}>
      {({ field }) => (
        <>
          <Spacing marginBottom={2}>
            <Field
              name={`${field}.name`}
              component={FormFieldInput}
              label="Nimi"
            />
          </Spacing>
          <Field name={`${field}.age`} component={FormFieldInput} label="Ikä" />
        </>
      )}
    </FieldArrayList>
    <Flex justifyCenter marginTop={fields.length > 0 ? 4 : 0}>
      <Button type="button" variant="outlined" onClick={() => fields.push({})}>
        Lisää henkilö
      </Button>
    </Flex>
  </>
);

storiesOf('FieldArrayList', module)
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeLocalizationDecorator())
  .add('Basic', () => (
    <StoryForm>
      <FieldArray name="fields" component={StoryFieldArrayList} />
    </StoryForm>
  ));
