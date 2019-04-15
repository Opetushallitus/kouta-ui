import React from 'react';
import { storiesOf } from '@storybook/react';

import FormControl from './index';
import FormLabel from '../FormLabel';
import Input from '../Input';
import FormHelperText from '../FormHelperText';

storiesOf('FormControl', module).add('Basic', () => (
  <FormControl>
    <FormLabel htmlFor="email">Email</FormLabel>
    <Input id="email" />
    <FormHelperText>Type a valid email</FormHelperText>
  </FormControl>
))
.add('With disabled', () => (
  <FormControl disabled>
    <FormLabel>Email</FormLabel>
    <Input />
    <FormHelperText>Type a valid email</FormHelperText>
  </FormControl>
))
.add('With error', () => (
  <FormControl error>
    <FormLabel>Email</FormLabel>
    <Input />
    <FormHelperText>That's not an email!</FormHelperText>
  </FormControl>
));
