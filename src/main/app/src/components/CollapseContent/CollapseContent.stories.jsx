import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import CollapseContent from './index';
import Typography from '../Typography';
import Button from '../Button';

const Story = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(currentOpen => !currentOpen)}>
        {open ? 'Close' : 'Open'}
      </Button>
      <CollapseContent open={open}>
        <Typography>Lorem ipsum dolor sit amet</Typography>
      </CollapseContent>
    </>
  );
};
storiesOf('CollapseContent', module).add('Basic', () => <Story />);
