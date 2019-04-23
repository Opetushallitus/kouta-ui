import React from 'react';
import { storiesOf } from '@storybook/react';

import Button from './index';

storiesOf('Button', module)
  .add('Basic', () => <Button>Button</Button>)
  .add('With variant', () => (
    <>
      <Button variant="contained">Button</Button>
      <Button variant="outlined">Button</Button>
    </>
  ))
  .add('With color', () => (
    <>
      <Button color="secondary">Secondary</Button>
      <Button color="primary">Primary</Button>
      <Button color="success">Success</Button>
      <Button color="danger">Danger</Button>
    </>
  ))
  .add('With size', () => (
    <>
      <Button variant="contained" size="small">Small</Button>
      <Button variant="contained" size="medium">Medium</Button>
    </>
  ));
