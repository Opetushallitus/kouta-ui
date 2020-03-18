import React from 'react';
import { Field } from 'redux-form';

import useTranslation from '../../useTranslation';
import KoulutusalatSelect from './KoulutusalatSelect';
import { createFormFieldComponent, selectMapProps } from '../../formFields';
import { getTestIdProps } from '../../../utils';

const KoulutusalatFieldComponent = createFormFieldComponent(
  KoulutusalatSelect,
  selectMapProps,
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
