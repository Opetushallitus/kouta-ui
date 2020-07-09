import React from 'react';
import { storiesOf } from '@storybook/react';

import { makeLocalizationDecorator } from '#/src/storybookUtils';
import FormEditInfo from './index';

storiesOf('FormEditInfo', module)
  .addDecorator(makeLocalizationDecorator())
  .add('Basic', () => (
    <FormEditInfo
      editorOid={null}
      date="2011-10-10T10:30"
      historyUrl="https://google.fi"
    />
  ));
