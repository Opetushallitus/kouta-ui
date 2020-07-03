import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import {
  createFormFieldComponent,
  selectMapProps,
} from '#/src/components/formFields';
import { getTestIdProps } from '#/src/utils';
import KoulutusalatSelect from './KoulutusalatSelect';

const KoulutusalatFieldComponent = createFormFieldComponent(
  KoulutusalatSelect,
  selectMapProps
);

export const KoulutusalatField = ({ disabled, name }) => {
  const { t } = useTranslation();

  return (
    <div {...getTestIdProps('koulutusalatSelect')}>
      <Field
        disabled={disabled}
        name={`${name}.koulutusalat`}
        component={KoulutusalatFieldComponent}
        label={t('koulutuslomake.valitseKoulutusalat')}
      />
    </div>
  );
};

export default KoulutusalatField;
