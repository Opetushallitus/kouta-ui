import React from 'react';

import { action } from 'storybook/actions';

import { FormButton } from '#/src/components/FormButton';
import { Typography } from '#/src/components/virkailija';

import Modal from './index';

const header = 'Lorem ipsum';

const footer = <FormButton>Sulje</FormButton>;

const content = <Typography>Lorem ipsum dolor sit amet</Typography>;

export default {
  title: 'Modal',
};

export const Basic = () => (
  <Modal header={header} footer={footer} onClose={action('close')} open>
    {content}
  </Modal>
);

export const WithFullWidth = {
  render: () => (
    <Modal
      header={header}
      footer={footer}
      onClose={action('close')}
      fullWidth
      open
    >
      {content}
    </Modal>
  ),

  name: 'With fullWidth',
};
