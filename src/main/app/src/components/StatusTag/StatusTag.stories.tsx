import React from 'react';
import { storiesOf } from '@storybook/react';

import { makeLocalizationDecorator } from '#/src/storybookUtils';
import StatusTag from './index';

storiesOf('StatusTag', module)
  .addDecorator(makeLocalizationDecorator())
  .add('Basic', () => <StatusTag status="julkaistu" />)
  .add('With status', () => (
    <>
      <StatusTag status="julkaistu" />
      <StatusTag status="tallennettu" />
      <StatusTag status="arkistoitu" />
    </>
  ))
  .add('With custom label', () => <StatusTag>Foo bar</StatusTag>)
  .add('With large', () => (
    <>
      <StatusTag status="julkaistu" large />
      <StatusTag status="tallennettu" large />
      <StatusTag status="arkistoitu" large />
    </>
  ));
