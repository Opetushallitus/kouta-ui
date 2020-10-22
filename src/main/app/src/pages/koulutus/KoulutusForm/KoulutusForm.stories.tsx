import React, { useMemo } from 'react';
import { storiesOf } from '@storybook/react';

import KoulutusForm, { initialValues } from './index';
import ReduxForm from '#/src/components/ReduxForm';
import getKoulutusFormConfig from '#/src/utils/koulutus/getKoulutusFormConfig';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import { useFieldValue } from '#/src/hooks/form';
import { OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

import {
  makeStoreDecorator,
  makeApiDecorator,
  makeLocalizationDecorator,
} from '#/src/storybookUtils';

const FormWrapper = props => {
  const koulutustyyppi = useFieldValue('koulutustyyppi');
  const config = useMemo(() => getKoulutusFormConfig(koulutustyyppi), [
    koulutustyyppi,
  ]);

  return (
    <FormConfigContext.Provider value={config}>
      <KoulutusForm {...props} />
    </FormConfigContext.Provider>
  );
};

storiesOf('KoulutusForm', module)
  .addDecorator(makeLocalizationDecorator())
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => {
    return (
      <ReduxForm form="koulutus" initialValues={initialValues}>
        <FormWrapper
          organisaatioOid={OPETUSHALLITUS_ORGANISAATIO_OID}
          isNewKoulutus={true}
        />
      </ReduxForm>
    );
  });
