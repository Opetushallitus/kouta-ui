import React, { useMemo } from 'react';
import { storiesOf } from '@storybook/react';

import KoulutusForm from './index';
import ReduxForm from '../ReduxForm';
import getKoulutusFormConfig from '../../utils/getKoulutusFormConfig';
import FormConfigContext from '../FormConfigContext';
import useFieldValue from '../useFieldValue';

import {
  makeStoreDecorator,
  makeApiDecorator,
  makeLocalisationDecorator,
} from '../../storybookUtils';

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
  .addDecorator(makeLocalisationDecorator())
  .addDecorator(makeStoreDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => {
    return (
      <ReduxForm form="koulutus">
        {() => (
          <FormWrapper
            organisaatioOid="1.2.246.562.10.594252633210"
            steps={false}
          />
        )}
      </ReduxForm>
    );
  });
