import React from 'react';

import HakukohdeForm, { initialValues } from './index';
import ReduxForm from '#/src/components/ReduxForm';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import { useEntityFormConfig } from '#/src/hooks/form';

import { KOULUTUSTYYPIT, ENTITY } from '#/src/constants';
import { makeStoreDecorator } from '#/src/storybookUtils';

export default {
  title: 'HakukohdeForm',
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
  const config = useEntityFormConfig(ENTITY.HAKUKOHDE, koulutustyyppi);
  return (
    <ReduxForm
      form="hakukohde"
      initialValues={initialValues('toteutuksen nimi', ['fi'])}
    >
      <FormConfigContext.Provider value={config}>
        <HakukohdeForm
          organisaatioOid="1.2.246.562.10.594252633210"
          steps={false}
          haku={{}}
          tarjoajat={[]}
          toteutus={{
            metadata: {
              opetus: {},
            },
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
