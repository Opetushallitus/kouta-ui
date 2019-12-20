import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { makeLocalisationDecorator } from '../../storybookUtils';
import FileInput from './index';

const upload = file => new Promise(resolve => {
    setTimeout(() => {
      resolve(URL.createObjectURL(file))
    }, 1000);
  });

const errorUpload = () => new Promise((resolve, reject) => setTimeout(reject, 1000));

const Story = () => {
  const [value, setValue] = useState([
    'https://www.oph.fi/instancedata/prime_product_julkaisu/oph/pics/opetushallitus2.gif',
  ]);

  return (
    <FileInput
      value={value}
      onChange={v => {
        action('change')(v);
        setValue(v);
      }}
      upload={upload}
      multiple
    />
  );
};

storiesOf('FileInput', module)
  .addDecorator(makeLocalisationDecorator())
  .add('Basic', () => <Story />)
  .add('With disabled', () => (
    <FileInput value={[]} onChange={action('change')} disabled />
  ))
  .add('With error', () => (
    <FileInput value={[]} onChange={action('change')} upload={upload} error />
  ))
  .add('With upload error', () => (
    <FileInput value={[]} onChange={action('change')} upload={errorUpload} />
  ));
