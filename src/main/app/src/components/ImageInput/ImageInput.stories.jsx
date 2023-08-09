import React, { useState } from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import { makeLocalizationDecorator } from '#/src/storybookUtils';

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

storiesOf('ImageInput', module)
  .addDecorator(makeLocalizationDecorator())
  .add('With external value', () => <Story />)
  .add('With disabled', () => (
    <ImageInput onChange={() => action('change')} disabled />
  ))
  .add('With external error', () => (
    <ImageInput
      onChange={() => action('change')}
      upload={upload}
      error="Attribuuttina annettu virhe"
    />
  ))
  .add('With failing upload', () => (
    <ImageInput onChange={() => action('change')} upload={errorUpload} />
  ));
