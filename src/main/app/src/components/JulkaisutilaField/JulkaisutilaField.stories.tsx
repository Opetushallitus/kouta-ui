import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';

import JulkaisutilaField from './index';
import ReduxForm from '../ReduxForm';

import {
  makeLocalisationDecorator,
  makeStoreDecorator,
} from '../../storybookUtils';

storiesOf('JulkaisutilaField', module)
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeLocalisationDecorator())
  .add('Basic', () => {
    const showArkistoitu = boolean('showArkistoitu', true);

    return (
      <ReduxForm form="form">
        {() => (
          <JulkaisutilaField name="tila" showArkistoitu={showArkistoitu} />
        )}
      </ReduxForm>
    );
  });
