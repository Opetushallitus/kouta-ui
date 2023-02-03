import React from 'react';

import ReduxForm from '#/src/components/ReduxForm';
import {
  ENTITY,
  FormMode,
  KOULUTUSTYYPIT,
  KOULUTUSTYYPPI,
} from '#/src/constants';

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

const Wrapper = ({ koulutustyyppi = KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS }) => {
  return (
    <ReduxForm
      form={ENTITY.TOTEUTUS}
      initialValues={initialValues({
        koulutus: {
          koulutustyyppi,
          nimi: 'koulutuksen nimi',
          kielivalinta: ['fi'],
        },
      })}
      mode={FormMode.CREATE}
    >
      <ToteutusForm
        organisaatioOid="1.2.246.562.10.594252633210"
        steps={false}
        koulutus={{
          koulutustyyppi,
        }}
      />
    </ReduxForm>
  );
};
Wrapper.args = {
  koulutustyyppi: KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
};

export const basic = ({ koulutustyyppi }) => (
  <Wrapper koulutustyyppi={koulutustyyppi} />
);
