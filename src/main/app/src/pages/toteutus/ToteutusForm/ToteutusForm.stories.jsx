import React from 'react';

import ReduxForm from '#/src/components/ReduxForm';
import { KOULUTUSTYYPIT } from '#/src/constants';

import { initialValues } from '../initialToteutusValues';
import ToteutusForm from './index';

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
      initialValues={initialValues({
        koulutustyyppi,
        koulutusNimi: 'koulutuksen nimi',
        koulutusKielet: ['fi'],
      })}
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
