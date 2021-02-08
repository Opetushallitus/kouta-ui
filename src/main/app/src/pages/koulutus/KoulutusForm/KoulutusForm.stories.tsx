import React, { useMemo } from 'react';

import { storiesOf } from '@storybook/react';

import ReduxForm from '#/src/components/ReduxForm';
import { OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import { useFieldValue } from '#/src/hooks/form';
import {
  makeStoreDecorator,
  makeApiDecorator,
  makeLocalizationDecorator,
} from '#/src/storybookUtils';
import getKoulutusFormConfig from '#/src/utils/koulutus/getKoulutusFormConfig';

import KoulutusForm, { initialValues } from './index';

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
