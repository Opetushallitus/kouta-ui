import React from 'react';

import { storiesOf } from '@storybook/react';

import ReduxForm from '#/src/components/ReduxForm';
import { ENTITY, FormMode, KOULUTUSTYYPPI } from '#/src/constants';

import { HakeutumisTaiIlmoittautumistapaSection } from './HakeutumisTaiIlmoittautumistapaSection';

storiesOf('HakeutumisTaiIlmoittautumisTapaSection', module).add('Basic', () => (
  <ReduxForm form={ENTITY.TOTEUTUS} initialValues={{}} mode={FormMode.CREATE}>
    <HakeutumisTaiIlmoittautumistapaSection
      language="fi"
      koulutustyyppi={KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS}
    />
  </ReduxForm>
));
