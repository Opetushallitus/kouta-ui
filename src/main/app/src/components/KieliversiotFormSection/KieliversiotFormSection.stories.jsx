import React from 'react';
import { storiesOf } from '@storybook/react';
import { reduxForm, Form } from 'redux-form';

import KieliversiotFormSection from './index';
import { makeStoreDecorator, makeApiDecorator } from '../../storybookUtils';

const StoryForm = reduxForm({
  form: 'storyForm',
})(({ children }) => <form children={children} />);

storiesOf('KieliversiotFormSection', module)
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => <StoryForm><KieliversiotFormSection /></StoryForm>);
