import React from 'react';

import { storiesOf } from '@storybook/react';

import ReduxForm from '#/src/components/ReduxForm';

import HakeutumisTaiIlmoittautumistapaSection from './HakeutumisTaiIlmoittautumistapaSection';

storiesOf('HakeutumisTaiIlmoittautumisTapaSection', module).add('Basic', () => (
  <ReduxForm form={'toteutus'}>
    <HakeutumisTaiIlmoittautumistapaSection language="fi" />
  </ReduxForm>
));
