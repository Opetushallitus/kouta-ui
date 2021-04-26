import React from 'react';

import { storiesOf } from '@storybook/react';

import { makeLocalizationDecorator } from '#/src/storybookUtils';

import SmallStatusTag from './SmallStatusTag';

storiesOf('SmallStatusTag', module)
  .addDecorator(makeLocalizationDecorator())
  .add('Basic', () => <SmallStatusTag status="julkaistu" />)
  .add('With status', () => (
    <>
      <SmallStatusTag status="julkaistu" />
      <SmallStatusTag status="tallennettu" />
      <SmallStatusTag status="arkistoitu" />
    </>
  ))
  .add('With custom label', () => <SmallStatusTag>Foo bar</SmallStatusTag>);
