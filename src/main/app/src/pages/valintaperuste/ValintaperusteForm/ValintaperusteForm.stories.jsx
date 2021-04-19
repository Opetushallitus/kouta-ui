import React from 'react';

import ReduxForm from '#/src/components/ReduxForm';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import { makeStoreDecorator } from '#/src/storybookUtils';

import { ValintaperusteForm, initialValues } from './index';

export default {
  title: 'ValintaperusteForm',
  decorators: [makeStoreDecorator()],
};

const formConfig = { noFieldConfigs: true };

const Wrapper = () => {
  const initial = initialValues(['fi']);

  return (
    <ReduxForm form="hakukohde" initialValues={initial}>
      <FormConfigContext.Provider value={formConfig}>
        <ValintaperusteForm organisaatioOid="1.2.246.562.10.594252633210" />
      </FormConfigContext.Provider>
    </ReduxForm>
  );
};

export const basic = () => <Wrapper />;
