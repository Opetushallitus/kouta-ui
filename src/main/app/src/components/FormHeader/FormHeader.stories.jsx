import React from 'react';
import { storiesOf } from '@storybook/react';

import FormHeader from './index';
import FormStatus from '../FormStatus';
import FormEditInfo from '../FormEditInfo';

storiesOf('FormHeader', module).add('Basic', () => (
  <FormHeader
    status={<FormStatus status="saved" />}
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
