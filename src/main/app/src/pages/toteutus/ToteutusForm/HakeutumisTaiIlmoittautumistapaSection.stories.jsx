import React from 'react';

import { storiesOf } from '@storybook/react';

import ReduxForm from '#/src/components/ReduxForm';
import { FormMode } from '#/src/constants';

import HakeutumisTaiIlmoittautumistapaSection from './HakeutumisTaiIlmoittautumistapaSection';

storiesOf('HakeutumisTaiIlmoittautumisTapaSection', module).add('Basic', () => (
  <ReduxForm form={'toteutus'} initialValues={{}} mode={FormMode.CREATE}>
    <HakeutumisTaiIlmoittautumistapaSection language="fi" />
  </ReduxForm>
));
