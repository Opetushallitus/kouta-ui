import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';

import Checkbox from './index';

storiesOf('Checkbox', module).add('Basic', () => {
  const checked = boolean('Checked', false);
  const disabled = boolean('Disabled', false);
  const indeterminate = boolean('Indeterminate', false);
  const error = boolean('Error', false);

  return (
    <>
      <Checkbox
        checked={checked}
        disabled={disabled}
        indeterminate={indeterminate}
        error={error}
        onChange={action('change')}
      >
        Checkbox
      </Checkbox>
    </>
  );
});
