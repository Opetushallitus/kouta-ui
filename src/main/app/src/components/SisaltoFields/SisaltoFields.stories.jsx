import React from 'react';

import { storiesOf } from '@storybook/react';
import { reduxForm } from 'redux-form';

import { SisaltoFields } from '.';

const StoryForm = reduxForm({
  form: 'storyForm',
})(({ children }) => <form children={children} />);

storiesOf('SisaltoFields', module).add('Basic', () => (
  <StoryForm>
    <SisaltoFields name="sisalto" />
  </StoryForm>
));
