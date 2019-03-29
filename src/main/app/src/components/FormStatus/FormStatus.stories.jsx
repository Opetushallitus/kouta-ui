import React from 'react';
import { storiesOf } from '@storybook/react';

import { makeLocalisationDecorator } from '../../storybookUtils';
import FormStatus from './index';

storiesOf('FormStatus', module)
  .addDecorator(makeLocalisationDecorator())
  .add('Basic', () => <FormStatus />)
  .add('With status', () => (
    <>
      <FormStatus status="julkaistu" />
      <FormStatus status="tallennettu" />
      <FormStatus status="arkistoitu" />
    </>
  ))
  .add('With custom label', () => <FormStatus>Foo bar</FormStatus>);
