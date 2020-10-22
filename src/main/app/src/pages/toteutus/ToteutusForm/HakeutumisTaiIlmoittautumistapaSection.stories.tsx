import React from 'react';
import { storiesOf } from '@storybook/react';

import ReduxForm from '#/src/components/ReduxForm';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import FormConfigSectionContext from '#/src/contexts/FormConfigSectionContext';
import getToteutusFormConfig from '#/src/utils/toteutus/getToteutusFormConfig';
import HakeutumisTaiIlmoittautumistapaSection from './HakeutumisTaiIlmoittautumistapaSection';
import { KOULUTUSTYYPPI } from '#/src/constants';

storiesOf('HakeutumisTaiIlmoittautumisTapaSection', module).add('Basic', () => (
  <ReduxForm form={'toteutus'}>
    <FormConfigContext.Provider
      value={getToteutusFormConfig(KOULUTUSTYYPPI.TUTKINNON_OSA)}
    >
      <FormConfigSectionContext.Provider value="hakeutumisTaiIlmoittautumistapa">
        <HakeutumisTaiIlmoittautumistapaSection />
      </FormConfigSectionContext.Provider>
    </FormConfigContext.Provider>
  </ReduxForm>
));
