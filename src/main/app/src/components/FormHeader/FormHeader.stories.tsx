import React from 'react';
import { storiesOf } from '@storybook/react';

import FormHeader from './index';
import StatusTag from '#/src/components/StatusTag';
import FormEditInfo from '#/src/components/FormEditInfo';

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
