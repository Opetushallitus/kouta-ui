import React from 'react';

import ReduxForm from '#/src/components/ReduxForm';
import { ENTITY, FormMode, KOULUTUSTYYPIT } from '#/src/constants';

import { initialValues } from '../initialToteutusValues';
import ToteutusForm from './index';

export default {
  title: 'ToteutusForm',
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
      form={ENTITY.TOTEUTUS}
      initialValues={initialValues({
        koulutustyyppi,
        koulutusNimi: 'koulutuksen nimi',
        koulutusKielet: ['fi'],
      })}
      mode={FormMode.CREATE}
    >
      <ToteutusForm
        organisaatioOid="1.2.246.562.10.594252633210"
        steps={false}
        koulutus={{
          koulutustyyppi,
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
