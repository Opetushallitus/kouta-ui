import React from 'react';

import ReduxForm from '#/src/components/ReduxForm';
import { KOULUTUSTYYPIT } from '#/src/constants';
import FormConfigContext from '#/src/contexts/FormConfigContext';

import ToteutusForm, { initialValues } from './index';
const config = { noFieldConfigs: true };
export default {
  title: 'ToteutusForm',
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
