import React from 'react';
import Switch from './index';

const Template = args => <Switch {...args} />;

export default {
  title: 'Switch',
  argTypes: {
    onChange: { action: 'changed' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
  },
};

export const Basic = Template.bind({});
