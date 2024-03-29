import React from 'react';

import ReduxForm from '#/src/components/ReduxForm';
import { ENTITY, FormMode, KOULUTUSTYYPIT } from '#/src/constants';

import { HakukohdeForm, initialValues } from './index';

export default {
  title: 'HakukohdeForm',
  argTypes: {
    koulutustyyppi: {
      options: KOULUTUSTYYPIT,
      control: {
        type: 'select',
      },
    },
  },
};

const Wrapper = ({ koulutustyyppi = 'amm' }) => {
  return (
    <ReduxForm
      form={ENTITY.HAKUKOHDE}
      initialValues={initialValues('toteutuksen nimi', ['fi'])}
      mode={FormMode.CREATE}
    >
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
    </ReduxForm>
  );
};
Wrapper.args = {
  koulutustyyppi: 'amm',
};

export const basic = ({ koulutustyyppi }) => (
  <Wrapper koulutustyyppi={koulutustyyppi} />
);
