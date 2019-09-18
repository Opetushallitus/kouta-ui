import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import PostinumeroSelect from './index';

import {
  makeApiDecorator,
  makeLocalisationDecorator,
} from '../../storybookUtils';

const Story = () => {
  const [value, setValue] = useState({ value: 'posti_00940#2' });

  return <PostinumeroSelect onChange={setValue} value={value} />;
};

storiesOf('PostinumeroSelect', module)
  .addDecorator(makeLocalisationDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => <Story />);
