import React, { useState } from 'react';

import { storiesOf } from '@storybook/react';

import Button from '#/src/components/Button';
import { Typography } from '#/src/components/virkailija';

import CollapseContent from './index';

const Story = ({ component: Component = CollapseContent }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(currentOpen => !currentOpen)}>
        {open ? 'Close' : 'Open'}
      </Button>
      <Component open={open}>
        <Typography>Lorem ipsum dolor sit amet</Typography>
      </Component>
    </>
  );
};

storiesOf('CollapseContent', module).add('Basic', () => <Story />);
