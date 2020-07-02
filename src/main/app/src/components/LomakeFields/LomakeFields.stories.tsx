import React from 'react';
import { storiesOf } from '@storybook/react';
import { reduxForm } from 'redux-form';

import LomakeFields from './index';
import {
  makeStoreDecorator,
  makeApiDecorator,
  makeLocalisationDecorator,
} from '../../storybookUtils';

const StoryForm = reduxForm({
  form: 'storyForm',
})(({ children }) => <form children={children} />);

storiesOf('LomakeFields', module)
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeApiDecorator())
  .addDecorator(makeLocalisationDecorator())
  .add('Basic', () => (
    <StoryForm>
      <LomakeFields name="lomake" />
    </StoryForm>
  ));
