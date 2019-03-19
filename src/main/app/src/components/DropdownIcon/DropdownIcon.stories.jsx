import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import DropdownIcon from './index';

const StoryContainer = () => {
  const [open, setOpen] = useState(false);

  return <DropdownIcon open={open} onClick={() => setOpen(open => !open)} />
}

storiesOf('DropdownIcon', module).add('Basic', () => (
  <StoryContainer />
));
