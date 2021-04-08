import React from 'react';

import { storiesOf } from '@storybook/react';

import { makeLocalizationDecorator } from '#/src/storybookUtils';

import LargeStatusTag from './LargeStatusTag';

storiesOf('LargeStatusTag', module)
  .addDecorator(makeLocalizationDecorator())
  .add('Basic', () => <LargeStatusTag status="julkaistu" />)
  .add('With status', () => (
    <>
      <LargeStatusTag status="julkaistu" />
      <LargeStatusTag status="tallennettu" />
      <LargeStatusTag status="arkistoitu" />
    </>
  ))
  .add('With custom label', () => <LargeStatusTag>Foo bar</LargeStatusTag>);
