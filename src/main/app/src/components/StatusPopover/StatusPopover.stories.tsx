import React from 'react';

import { action } from '@storybook/addon-actions';

import { FormButton } from '#/src/components/FormButton';
import { Typography } from '#/src/components/virkailija';

import StatusPopover from './index';

export default {
  title: 'StatusPopover',
};

export const Basic = () => (
  <div style={{ paddingTop: '80vh' }}>
    <StatusPopover
      header="Toteutuksesi on julkaistu onnistuneesti"
      body={
        <Typography>
          Mikäli haluat luoda uuden haun ja liittää sen tähän koulutukseen,
          valitse Luo uusi haku
        </Typography>
      }
      status="success"
      onClose={action('close')}
      visible
    >
      {({ ref }) => <FormButton ref={ref}>Button</FormButton>}
    </StatusPopover>
  </div>
);

export const WithDangerStatus = {
  render: () => (
    <div style={{ paddingTop: '80vh' }}>
      <StatusPopover
        header="Toteutuksesi julkaisu epäonnistui"
        body={<Typography>Yritä uudelleen</Typography>}
        status="danger"
        visible
      >
        {({ ref }) => <FormButton ref={ref}>Button</FormButton>}
      </StatusPopover>
    </div>
  ),

  name: 'With danger status',
};
