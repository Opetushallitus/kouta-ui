import React, { useState } from 'react';

import { storiesOf } from '@storybook/react';

import { FormButton } from '#/src/components/FormButton';
import { Typography } from '#/src/components/virkailija';

import CollapseContent from './index';

const Story = ({ component: Component = CollapseContent }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <FormButton onClick={() => setOpen(currentOpen => !currentOpen)}>
        {open ? 'Close' : 'Open'}
      </FormButton>
      <Component open={open}>
        <Typography>Lorem ipsum dolor sit amet</Typography>
      </Component>
    </>
  );
};

storiesOf('CollapseContent', module).add('Basic', () => <Story />);
