import type { Meta, StoryObj } from '@storybook/react-vite';

import { Switch } from './index';

const meta: Meta<typeof Switch> = {
  component: Switch,
  argTypes: {
    onChange: { action: 'changed' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Basic: Story = {
  render: props => <Switch {...props} />,
};
