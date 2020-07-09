import React from 'react';
import { storiesOf } from '@storybook/react';
import { reduxForm } from 'redux-form';

import ValintatapaContentFields from './index';
import { makeStoreDecorator } from '#/src/storybookUtils';

const StoryForm = reduxForm({
  form: 'storyForm',
})(({ children }) => <form children={children} />);

storiesOf('ValintatapaContentFields', module)
  .addDecorator(makeStoreDecorator({ logging: true }))
  .add('Basic', () => (
    <StoryForm>
      <ValintatapaContentFields name="sisalto" />
    </StoryForm>
  ));
