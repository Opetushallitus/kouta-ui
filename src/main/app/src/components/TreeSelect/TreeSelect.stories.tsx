import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import TreeSelect from './index';

const options = [
  {
    label: 'Option 1',
    value: '1',
    children: [
      {
        label: 'Option 1.1',
        value: '1.1',
        children: [{ label: 'Option 1.1.1', value: '1.1.1' }],
      },
      { label: 'Option 1.2', value: '1.2', disabled: true },
    ],
  },
  {
    label: 'Option 2',
    value: '2',
    children: [{ label: 'Option 2.1', value: '2.1' }],
  },
];

const Story = () => {
  const [value, setValue] = useState([]);

  return <TreeSelect options={options} value={value} onChange={setValue} />;
};

storiesOf('TreeSelect', module).add('Basic', () => <Story />);
