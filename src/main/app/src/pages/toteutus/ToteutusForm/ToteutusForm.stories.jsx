import React from 'react';

import ReduxForm from '#/src/components/ReduxForm';
import { KOULUTUSTYYPIT, ENTITY } from '#/src/constants';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import { useEntityFormConfig } from '#/src/hooks/form';
import { makeStoreDecorator } from '#/src/storybookUtils';

import ToteutusForm, { initialValues } from './index';

export default {
  title: 'ToteutusForm',
  decorators: [makeStoreDecorator()],
  argTypes: {
    koulutustyyppi: {
      control: {
        type: 'select',
        options: KOULUTUSTYYPIT,
      },
    },
  },
};

const Wrapper = ({ koulutustyyppi = 'amm' }) => {
  const config = useEntityFormConfig(ENTITY.TOTEUTUS, koulutustyyppi);
  return (
    <ReduxForm
      form="toteutus"
      initialValues={initialValues('koulutuksen nimi', ['fi'])}
    >
      <FormConfigContext.Provider value={config}>
        <ToteutusForm
          organisaatioOid="1.2.246.562.10.594252633210"
          steps={false}
          koulutus={{
            koulutustyyppi,
          }}
          koulutustyyppi={koulutustyyppi}
        />
      </FormConfigContext.Provider>
    </ReduxForm>
  );
};
Wrapper.args = {
  koulutustyyppi: 'amm',
};

export const basic = ({ koulutustyyppi }) => (
  <Wrapper koulutustyyppi={koulutustyyppi} />
);
