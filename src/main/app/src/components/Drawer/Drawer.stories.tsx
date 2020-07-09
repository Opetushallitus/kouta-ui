import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import Drawer from './index';
import Button from '#/src/components/Button';

const StoryDrawer = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Open
      </Button>
      <Drawer
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        Lorem ipsum
      </Drawer>
    </>
  );
};

storiesOf('Drawer', module).add('Basic', () => <StoryDrawer />);
