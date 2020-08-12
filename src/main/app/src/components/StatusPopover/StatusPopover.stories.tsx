import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import StatusPopover from './index';
import Button from '#/src/components/Button';
import { Typography } from '#/src/components/virkailija';

storiesOf('StatusPopover', module)
  .add('Basic', () => (
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
        {({ ref }) => <Button ref={ref}>Button</Button>}
      </StatusPopover>
    </div>
  ))
  .add('With danger status', () => (
    <div style={{ paddingTop: '80vh' }}>
      <StatusPopover
        header="Toteutuksesi julkaisu epäonnistui"
        body={<Typography>Yritä uudelleen</Typography>}
        status="danger"
        visible
      >
        {({ ref }) => <Button ref={ref}>Button</Button>}
      </StatusPopover>
    </div>
  ));
