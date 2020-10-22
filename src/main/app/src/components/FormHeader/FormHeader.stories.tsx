import React from 'react';
import { Router } from 'react-router-dom';
import { storiesOf } from '@storybook/react';

import FormHeader from './index';
import StatusTag from '#/src/components/StatusTag';
import FormEditInfo from '#/src/components/FormEditInfo';
import { createBrowserHistory } from 'history';

storiesOf('FormHeader', module).add('Basic', () => (
  <Router history={createBrowserHistory()}>
    <FormHeader
      status={
        <StatusTag status="saved" large>
          Julkaistu
        </StatusTag>
      }
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
