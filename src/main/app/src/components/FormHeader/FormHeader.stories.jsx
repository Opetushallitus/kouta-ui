import React from 'react';

import { storiesOf } from '@storybook/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';

import FormEditInfo from '#/src/components/FormEditInfo';

import LargeStatusTag from '../StatusTag/LargeStatusTag';
import FormHeader from './index';

storiesOf('FormHeader', module).add('Basic', () => (
  <Router history={createBrowserHistory()}>
    <FormHeader
      status={<LargeStatusTag status="saved">Julkaistu</LargeStatusTag>}
      editInfo={
        <FormEditInfo
          editor="John Doe"
          date={new Date(1547205166507)}
          historyUrl="https://google.fi"
        />
      }
    >
      Tutkintoon johtava koulutus
    </FormHeader>
  </Router>
));
