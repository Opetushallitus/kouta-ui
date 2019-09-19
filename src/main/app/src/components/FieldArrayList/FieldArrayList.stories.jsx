import React from 'react';
import { storiesOf } from '@storybook/react';
import { reduxForm, Field, FieldArray } from 'redux-form';

import FieldArrayList from './index';
import { FormFieldInput } from '../formFields';
import Button from '../Button';
import Spacing from '../Spacing';
import Flex from '../Flex';

import {
  makeStoreDecorator,
  makeLocalisationDecorator,
} from '../../storybookUtils';

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
  .addDecorator(makeLocalisationDecorator())
  .add('Basic', () => (
    <StoryForm>
      <FieldArray name="fields" component={StoryFieldArrayList} />
    </StoryForm>
  ));
