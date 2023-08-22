import React from 'react';

import { reduxForm } from 'redux-form';

import { SisaltoFields } from '.';

const StoryForm = reduxForm({
  form: 'storyForm',
})(({ children }) => <form>{children}</form>);

export default {
  title: 'SisaltoFields',
};

export const Basic = () => (
  <StoryForm>
    <SisaltoFields name="sisalto" />
  </StoryForm>
);
