import { storiesOf } from '@storybook/react';
import React from 'react';
import { reduxForm } from 'redux-form';
import { makeStoreDecorator } from '#/src/storybookUtils';
import { SisaltoFields } from '../SisaltoFields';

const StoryForm = reduxForm({
  form: 'storyForm',
})(({ children }) => <form children={children} />);

storiesOf('ValintatapaContentFields', module)
  .addDecorator(makeStoreDecorator({ logging: true }))
  .add('Basic', () => (
    <StoryForm>
      <SisaltoFields name="sisalto" />
    </StoryForm>
  ));
