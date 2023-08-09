import React from 'react';

import _fp from 'lodash/fp';

import useToaster from '#/src/hooks/useToaster';

import Toaster from './index';

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

export default {
  title: 'Toaster',
};

export const Basic = () => {
  const { openToast } = useToaster();

  return (
    <>
      <Toaster style={{ position: 'fixed', top: '16px', right: '16px' }} />
      <button
        onClick={() =>
          openToast({
            ...toastsArray[_fp.random(0, 1)],
            key: _fp.uniqueId('toast_'),
          })
        }
      >
        Add toast
      </button>
    </>
  );
};
