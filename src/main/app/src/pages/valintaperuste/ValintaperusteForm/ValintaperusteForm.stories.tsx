import React from 'react';

import ReduxForm from '#/src/components/ReduxForm';
import { ENTITY, FormMode } from '#/src/constants';

import { ValintaperusteForm, initialValues } from './index';

export default {
  title: 'ValintaperusteForm',
};

const Wrapper = () => {
  const initial = initialValues(['fi']);

  return (
    <ReduxForm
      form={ENTITY.VALINTAPERUSTE}
      initialValues={initial}
      mode={FormMode.CREATE}
    >
      <ValintaperusteForm organisaatioOid="1.2.246.562.10.594252633210" />
    </ReduxForm>
  );
};

export const Basic = () => <Wrapper />;
