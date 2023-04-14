import { Switch } from './index';

export default {
  title: 'Switch',
  argTypes: {
    onChange: { action: 'changed' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
  },
};

export const Basic = Switch.bind({});
