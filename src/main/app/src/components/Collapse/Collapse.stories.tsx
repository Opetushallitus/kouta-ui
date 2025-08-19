import React from 'react';

import { action } from 'storybook/actions';

import { FormButton } from '#/src/components/FormButton';
import { Typography } from '#/src/components/virkailija';

import Collapse from './index';

const header = '1 Koulutustyyppi';

const footer = (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <FormButton variant="outlined">Tyhjennä tiedot</FormButton>
    <FormButton>Jatka</FormButton>
  </div>
);

const children = <Typography>Content</Typography>;

export default {
  title: 'Collapse',
};

export const Basic = () => (
  <Collapse
    header={header}
    footer={footer}
    open={true}
    onToggle={action('toggle')}
  >
    {children}
  </Collapse>
);

export const WithActive = {
  render: () => (
    <Collapse
      header={header}
      footer={footer}
      open={true}
      active={true}
      onToggle={action('toggle')}
    >
      {children}
    </Collapse>
  ),

  name: 'With active',
};
