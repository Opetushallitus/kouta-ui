import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';

import KoulutustyyppiSelect from './index';

const change = action('change');

const Story = props => {
  const [value, setValue] = useState();

  return (
    <KoulutustyyppiSelect
      {...props}
      value={value}
      onChange={e => {
        setValue(e ? e.target.value : undefined);
        change(e);
      }}
    />
  );
};

storiesOf('KoulutustyyppiSelect', module).add('Basic', () => {
  const johtaaTutkintoon = boolean('Johtaa tutkintoon', true);

  return <Story johtaaTutkintoon={johtaaTutkintoon} />;
});
