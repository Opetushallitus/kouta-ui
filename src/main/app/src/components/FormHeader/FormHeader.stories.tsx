import React from 'react';
import { storiesOf } from '@storybook/react';

import FormHeader from './index';
import StatusTag from '../StatusTag';
import FormEditInfo from '../FormEditInfo';

storiesOf('FormHeader', module).add('Basic', () => (
  <FormHeader
    status={<StatusTag status="saved" large />}
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
));
