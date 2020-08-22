import React from 'react';

import ValintaperusteForm, { initialValues } from './index';
import ReduxForm from '#/src/components/ReduxForm';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import { useEntityFormConfig } from '#/src/hooks/form';

import { ENTITY } from '#/src/constants';
import { makeStoreDecorator } from '#/src/storybookUtils';
import { useFieldConfig } from '#/src/hooks/fieldConfigHooks';

export default {
  title: 'ValintaperusteForm',
  decorators: [makeStoreDecorator()],
};

const Wrapper = () => {
  const koulutustyyppi = useFieldConfig('perustiedot.tyyppi');
  const initial = initialValues(['fi']);
  const config = useEntityFormConfig(
    ENTITY.VALINTAPERUSTE,
    koulutustyyppi || initial?.perustiedot?.tyyppi
  );
  return (
    <ReduxForm form="hakukohde" initialValues={initial}>
      <FormConfigContext.Provider value={config}>
        <ValintaperusteForm organisaatioOid="1.2.246.562.10.594252633210" />
      </FormConfigContext.Provider>
    </ReduxForm>
  );
};

export const basic = ({ koulutustyyppi }) => <Wrapper />;
