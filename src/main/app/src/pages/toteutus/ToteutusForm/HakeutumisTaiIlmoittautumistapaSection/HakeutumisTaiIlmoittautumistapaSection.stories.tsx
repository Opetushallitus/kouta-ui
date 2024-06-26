import React from 'react';

import ReduxForm from '#/src/components/ReduxForm';
import { ENTITY, FormMode } from '#/src/constants';

import { HakeutumisTaiIlmoittautumistapaSection } from './HakeutumisTaiIlmoittautumistapaSection';

export default {
  title: 'HakeutumisTaiIlmoittautumisTapaSection',
};

export const Basic = () => (
  <ReduxForm form={ENTITY.TOTEUTUS} initialValues={{}} mode={FormMode.CREATE}>
    <HakeutumisTaiIlmoittautumistapaSection
      language="fi"
      hasHakukohdeAttached={false}
    />
  </ReduxForm>
);
