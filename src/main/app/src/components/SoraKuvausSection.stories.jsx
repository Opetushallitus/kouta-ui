import React from 'react';

import { storiesOf } from '@storybook/react';

import FormConfigContext from '../contexts/FormConfigContext';
import FormConfigSectionContext from '../contexts/FormConfigSectionContext';
import getValintaperusteFormConfig from '../utils/valintaperuste/getValintaperusteFormConfig';
import ReduxForm from './ReduxForm';
import SoraKuvausSection from './SoraKuvausSection';

storiesOf('SoraKuvausSection', module).add('Basic', () => (
  <ReduxForm form={'valintaperuste'}>
    <FormConfigContext.Provider value={getValintaperusteFormConfig('amm')}>
      <FormConfigSectionContext.Provider value="soraKuvaus">
        <SoraKuvausSection
          organisaatioOid="1.2.246.562.10.94639300915"
          name="soraKuvaus"
          languages={['fi']}
        />
      </FormConfigSectionContext.Provider>
    </FormConfigContext.Provider>
  </ReduxForm>
));
