import React from 'react';

import { storiesOf } from '@storybook/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';

import LargeStatusTag from '../StatusTag/LargeStatusTag';
import FormHeader from './index';

storiesOf('FormHeader', module).add('Basic', () => (
  <Router history={createBrowserHistory()}>
    <FormHeader
      title="Tutkintoon johtava koulutus"
      status={<LargeStatusTag status="saved">Julkaistu</LargeStatusTag>}
    />
  </Router>
));
