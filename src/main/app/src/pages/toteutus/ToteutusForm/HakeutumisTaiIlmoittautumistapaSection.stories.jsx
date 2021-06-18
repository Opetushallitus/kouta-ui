import React from 'react';

import { storiesOf } from '@storybook/react';

import ReduxForm from '#/src/components/ReduxForm';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import FormConfigSectionContext from '#/src/contexts/FormConfigSectionContext';

import HakeutumisTaiIlmoittautumistapaSection from './HakeutumisTaiIlmoittautumistapaSection';

storiesOf('HakeutumisTaiIlmoittautumisTapaSection', module).add('Basic', () => (
  <ReduxForm form={'toteutus'}>
    <FormConfigContext.Provider value={{}}>
      <FormConfigSectionContext.Provider value="hakeutumisTaiIlmoittautumistapa">
        <HakeutumisTaiIlmoittautumistapaSection language="fi" />
      </FormConfigSectionContext.Provider>
    </FormConfigContext.Provider>
  </ReduxForm>
));
