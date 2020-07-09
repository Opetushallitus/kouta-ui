import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';

import JulkaisutilaField from './index';
import ReduxForm from '#/src/components/ReduxForm';

import {
  makeLocalizationDecorator,
  makeStoreDecorator,
} from '#/src/storybookUtils';

storiesOf('JulkaisutilaField', module)
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeLocalizationDecorator())
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
