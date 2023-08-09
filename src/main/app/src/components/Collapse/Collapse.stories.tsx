import React from 'react';

import { action } from '@storybook/addon-actions';

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

export const WithUncontrolled = () => (
  <Collapse header={header} footer={footer} defaultOpen={true}>
    {children}
  </Collapse>
);

WithUncontrolled.storyName = 'With uncontrolled';

export const WithActive = () => (
  <Collapse
    header={header}
    footer={footer}
    open={true}
    active={true}
    onToggle={action('toggle')}
  >
    {children}
  </Collapse>
);

WithActive.storyName = 'With active';
