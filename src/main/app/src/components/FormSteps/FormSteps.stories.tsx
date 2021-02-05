import React from 'react';

import { storiesOf } from '@storybook/react';

import FormSteps from './index';

storiesOf('FormSteps', module).add('Basic', () => (
  <FormSteps activeStep="hakukohde" />
));
