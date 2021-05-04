import React from 'react';

import { storiesOf } from '@storybook/react';

import ReduxForm from '#/src/components/ReduxForm';
import { OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';
import {
  makeStoreDecorator,
  makeApiDecorator,
  makeLocalizationDecorator,
} from '#/src/storybookUtils';

import KoulutusForm, { initialValues } from './index';

storiesOf('KoulutusForm', module)
  .addDecorator(makeLocalizationDecorator())
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => {
    return (
      <ReduxForm form="koulutus" initialValues={initialValues}>
        <KoulutusForm
          organisaatioOid={OPETUSHALLITUS_ORGANISAATIO_OID}
          isNewKoulutus={true}
        />
      </ReduxForm>
    );
  });
