import React from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import Button from '#/src/components/Button';
import { Typography } from '#/src/components/virkailija';

import Collapse from './index';

const header = '1 Koulutustyyppi';

const footer = (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <Button variant="outlined">Tyhjennä tiedot</Button>
    <Button>Jatka</Button>
  </div>
);

const children = <Typography>Content</Typography>;

storiesOf('Collapse', module)
  .add('Basic', () => (
    <Collapse
      header={header}
      footer={footer}
      open={true}
      onToggle={action('toggle')}
    >
      {children}
    </Collapse>
  ))
  .add('With uncontrolled', () => (
    <Collapse header={header} footer={footer} defaultOpen={true}>
      {children}
    </Collapse>
  ))
  .add('With active', () => (
    <Collapse
      header={header}
      footer={footer}
      open={true}
      active={true}
      onToggle={action('toggle')}
    >
      {children}
    </Collapse>
  ));
