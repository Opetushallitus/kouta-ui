import React from 'react';

import ReduxForm from '#/src/components/ReduxForm';
import { ENTITY, OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

import { KoulutusForm } from './KoulutusForm';
import { initialKoulutusValues } from '../initialKoulutusValues';

export default {
  title: 'KoulutusForm',
};

export const Basic = () => {
  return (
    <ReduxForm form={ENTITY.KOULUTUS} initialValues={initialKoulutusValues}>
      <KoulutusForm
        organisaatioOid={OPETUSHALLITUS_ORGANISAATIO_OID}
        isNewKoulutus={true}
      />
    </ReduxForm>
  );
};
