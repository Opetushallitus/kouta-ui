import React from 'react';
import { storiesOf } from '@storybook/react';
import { reduxForm } from 'redux-form';

import LomakeFields from './index';
import {
  makeStoreDecorator,
  makeApiDecorator,
  makeLocalizationDecorator,
} from '#/src/storybookUtils';

const StoryForm = reduxForm({
  form: 'storyForm',
})(({ children }) => <form children={children} />);

storiesOf('LomakeFields', module)
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeApiDecorator())
  .addDecorator(makeLocalizationDecorator())
  .add('Basic', () => (
    <StoryForm>
      <LomakeFields name="lomake" />
    </StoryForm>
  ));
