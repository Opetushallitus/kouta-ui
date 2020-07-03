import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';

import Switch from './index';

storiesOf('Switch', module).add('Basic', () => (
  <Switch
    onChange={action('change')}
    checked={boolean('Checked', false)}
    disabled={boolean('Disabled', false)}
    error={boolean('Error', false)}
  >
    Switch
  </Switch>
));
