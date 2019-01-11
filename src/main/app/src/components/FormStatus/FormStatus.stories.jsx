import React from 'react';
import { storiesOf } from '@storybook/react';

import FormStatus from './index';

storiesOf('FormStatus', module)
  .add('Basic', () => <FormStatus />)
  .add('With status', () => (
    <>
      <FormStatus status="saved" />
      <FormStatus status="archived" />
      <FormStatus status="published" />
    </>
  ))
  .add('With custom label', () => <FormStatus>Foo bar</FormStatus>);
