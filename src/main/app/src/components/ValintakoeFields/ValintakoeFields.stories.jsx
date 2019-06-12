import React from 'react';
import { storiesOf } from '@storybook/react';
import { reduxForm } from 'redux-form';

import ValintakoeFields from './index';
import {
  makeStoreDecorator,
  makeApiDecorator,
  makeLocalisationDecorator,
} from '../../storybookUtils';

const StoryForm = reduxForm({
  form: 'storyForm',
})(({ children }) => <form children={children} />);

storiesOf('ValintakoeFields', module)
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeApiDecorator())
  .addDecorator(makeLocalisationDecorator())
  .add('Basic', () => (
    <StoryForm>
      <ValintakoeFields />
    </StoryForm>
  ));
