import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Modal, { ModalController } from './index';

import Button from '../Button';
import Typography from '../Typography';

const header = 'Lorem ipsum';

const footer = <Button>Sulje</Button>;

const content = <Typography>Lorem ipsum dolor sit amet</Typography>;

const modal = ({ onClose, customProp, ...props }) => (
  <Modal
    header={header}
    footer={<Button onClick={onClose}>Sulje</Button>}
    onClose={onClose}
    {...props}
  >
    {customProp}
  </Modal>
);

storiesOf('Modal', module)
  .add('Basic', () => (
    <Modal header={header} footer={footer} onClose={action('close')} open>
      {content}
    </Modal>
  ))
  .add('With fullWidth', () => (
    <Modal header={header} footer={footer} onClose={action('close')} fullWidth open>
      {content}
    </Modal>
  ))
  .add('With ModalController', () => (
    <ModalController modal={modal} defaultOpen={false} customProp="Hello world!">
      {({ onToggle }) => <Button onClick={onToggle}>Avaa</Button>}
    </ModalController>
  ));
