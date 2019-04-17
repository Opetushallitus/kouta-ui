import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { makeLocalisationDecorator } from '../../storybookUtils';
import FileInput from './index';

const upload = binaries =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(binaries.map(() => 'file'));
    }, 1000);
  });

storiesOf('FileInput', module)
  .addDecorator(makeLocalisationDecorator())
  .add('Basic', () => (
    <FileInput value={null} onChange={action('change')} upload={upload} multiple />
  ));
