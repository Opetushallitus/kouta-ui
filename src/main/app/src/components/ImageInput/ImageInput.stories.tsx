import React, { useState } from 'react';

import { action } from '@storybook/addon-actions';

import ImageInput from './index';

const upload = file =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(URL.createObjectURL(file));
    }, 1000);
  });

const errorUpload = () =>
  new Promise((resolve, reject) =>
    setTimeout(() => reject(new Error('Upload Failed')), 1000)
  );

const Story = () => {
  const [value, setValue] = useState(
    'https://www.oph.fi/sites/default/files/styles/hero/public/2019-02/design_factory_9729.jpg'
  );

  return (
    <ImageInput
      value={value}
      onChange={v => {
        action('change')(v);
        setValue(v);
      }}
      upload={upload}
      minDimensions={{ width: 1000, height: 400 }}
      maxSize={2000000}
      accept={['.jpg', 'jpeg', '.png']}
    />
  );
};

export default {
  title: 'ImageInput',
};

export const WithExternalValue = () => <Story />;

WithExternalValue.storyName = 'With external value';

export const WithDisabled = () => (
  <ImageInput onChange={() => action('change')} disabled />
);

WithDisabled.storyName = 'With disabled';

export const WithExternalError = () => (
  <ImageInput
    onChange={() => action('change')}
    upload={upload}
    error="Attribuuttina annettu virhe"
  />
);

WithExternalError.storyName = 'With external error';

export const WithFailingUpload = () => (
  <ImageInput onChange={() => action('change')} upload={errorUpload} />
);

WithFailingUpload.storyName = 'With failing upload';
