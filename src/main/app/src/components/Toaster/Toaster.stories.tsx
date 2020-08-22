import React from 'react';
import { storiesOf } from '@storybook/react';
import _ from 'lodash/fp';

import Toaster from './index';
import useToaster from '#/src/hooks/useToaster';

const toastsArray = [
  {
    label: 'Koulutus on tallennettu onnistuneesti',
    status: 'info',
    key: '1',
  },
  {
    label:
      'Jokin meni vikaan. Jos virhe aiheuttaa ongelmia, yritä päivittää sivu',
    status: 'danger',
    key: '2',
  },
];

storiesOf('Toaster', module).add('Basic', () =>
  React.createElement(() => {
    const { openToast } = useToaster();

    return (
      <>
        <Toaster style={{ position: 'fixed', top: '16px', right: '16px' }} />
        <button
          onClick={() =>
            openToast({
              ...toastsArray[_.random(0, 1)],
              key: _.uniqueId('toast_'),
            })
          }
        >
          Add toast
        </button>
      </>
    );
  })
);
