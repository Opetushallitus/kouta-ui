import React from 'react';

import { storiesOf } from '@storybook/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';

import FormHeader from './index';
import LargeStatusTag from '../StatusTag/LargeStatusTag';

storiesOf('FormHeader', module).add('Basic', () => (
  <Router history={createBrowserHistory()}>
    <FormHeader
      title="Tutkintoon johtava koulutus"
      status={<LargeStatusTag status="saved">Julkaistu</LargeStatusTag>}
    />
  </Router>
));
