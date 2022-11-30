import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import {
  createFormFieldComponent,
  selectMapProps,
} from '#/src/components/formFields';
import { getTestIdProps } from '#/src/utils';

import ErikoistumiskoulutusSelect from './ErikoistumiskoulutusSelect';

const ErikoistumiskoulutusFieldComponent = createFormFieldComponent(
  ErikoistumiskoulutusSelect,
  selectMapProps
);

export const ErikoistumiskoulutusField = ({ required, disabled, name }) => {
  const { t } = useTranslation();

  return (
    <div {...getTestIdProps('erikoistumiskoulutusSelect')}>
      <Field
        required={required}
        disabled={disabled}
        name={`${name}.erikoistumiskoulutus`}
        component={ErikoistumiskoulutusFieldComponent}
        label={t('koulutuslomake.valitseErikoistumiskoulutus')}
      />
    </div>
  );
};

export default ErikoistumiskoulutusField;
