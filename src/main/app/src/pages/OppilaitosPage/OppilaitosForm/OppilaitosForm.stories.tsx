import React from 'react';
import { storiesOf } from '@storybook/react';

import OppilaitosForm, { initialValues } from './index';
import ReduxForm from '#/src/components/ReduxForm';

import {
  makeStoreDecorator,
  makeApiDecorator,
  makeLocalizationDecorator,
} from '#/src/storybookUtils';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import getOppilaitosFormConfig from '#/src/utils/oppilaitos/getOppilaitosFormConfig';

storiesOf('OppilaitosForm', module)
  .addDecorator(makeLocalizationDecorator())
  .addDecorator(makeStoreDecorator({ logging: true }))
  .addDecorator(makeApiDecorator())
  .add('Basic', () => (
    <ReduxForm form="oppilaitosForm" initialValues={initialValues}>
      <FormConfigContext.Provider value={getOppilaitosFormConfig()}>
        <OppilaitosForm organisaatioOid="1.2.246.562.10.39218317368" />
      </FormConfigContext.Provider>
    </ReduxForm>
  ));
