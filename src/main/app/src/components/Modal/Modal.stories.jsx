import React from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import { FormButton } from '#/src/components/FormButton';
import { Typography } from '#/src/components/virkailija';

import Modal from './index';

const header = 'Lorem ipsum';

const footer = <FormButton>Sulje</FormButton>;

const content = <Typography>Lorem ipsum dolor sit amet</Typography>;

storiesOf('Modal', module)
  .add('Basic', () => (
    <Modal header={header} footer={footer} onClose={action('close')} open>
      {content}
    </Modal>
  ))
  .add('With fullWidth', () => (
    <Modal
      header={header}
      footer={footer}
      onClose={action('close')}
      fullWidth
      open
    >
      {content}
    </Modal>
  ));
