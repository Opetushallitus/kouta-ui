import React from 'react';
import { storiesOf } from '@storybook/react';

import Typography from './index';

storiesOf('Typography', module)
  .add('Basic', () => <Typography>Hello world!</Typography>)
  .add('With variant', () => (
    <>
      <Typography variant="body">Body (default)</Typography>
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="h4">Heading 4</Typography>
      <Typography variant="h5">Heading 5</Typography>
      <Typography variant="h6">Heading 6</Typography>
    </>
  ))
  .add('With spacing', () => (
    <>
      <Typography
        variant="h1"
        marginTop={1}
        marginBottom={2}
        marginLeft={3}
        marginRight={4}
      >
        Margin
      </Typography>
      <Typography
        variant="h1"
        paddingTop={1}
        paddingBottom={2}
        paddingLeft={3}
        paddingRight={4}
      >
        Padding
      </Typography>
    </>
  ));
