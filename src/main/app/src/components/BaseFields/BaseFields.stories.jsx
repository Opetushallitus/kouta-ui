import React from 'react';
import { storiesOf } from '@storybook/react';
import { reduxForm, Form } from 'redux-form';

import BaseFields from './index';
import { makeStoreDecorator, makeApiDecorator, makeLocalisationDecorator } from '../../storybookUtils';

const StoryForm = reduxForm({
  form: 'storyForm',
})(({ children }) => <form children={children} />);

storiesOf('BaseFields', module)
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeApiDecorator())
  .addDecorator(makeLocalisationDecorator())
  .add('Basic', () => <StoryForm><BaseFields createLabel="Luo uusi" copyLabel="Kopio" existingLabel="Käytä aiempaa" /></StoryForm>);
