import React from 'react';

import { storiesOf } from '@storybook/react';

import ReduxForm from '#/src/components/ReduxForm';
import { OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

import { initialKoulutusValues } from '../initialKoulutusValues';
import { KoulutusForm } from './KoulutusForm';

storiesOf('KoulutusForm', module).add('Basic', () => {
  return (
    <ReduxForm form="koulutus" initialValues={initialKoulutusValues}>
      <KoulutusForm
        organisaatioOid={OPETUSHALLITUS_ORGANISAATIO_OID}
        isNewKoulutus={true}
      />
    </ReduxForm>
  );
});
