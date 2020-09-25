import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import {
  createFormFieldComponent,
  selectMapProps,
} from '#/src/components/formFields';
import { getTestIdProps } from '#/src/utils';
import KoulutusalaSelect from '#/src/components/KoulutusalaSelect';

const KoulutusalaFieldComponent = createFormFieldComponent(
  KoulutusalaSelect,
  selectMapProps
);

export const KoulutusalatField = ({ disabled, name }) => {
  const { t } = useTranslation();

  return (
    <div {...getTestIdProps('koulutusalatSelect')}>
      <Field
        disabled={disabled}
        name={`${name}.koulutusalat`}
        component={KoulutusalaFieldComponent}
        label={t('koulutuslomake.valitseKoulutusalat')}
        isMulti={true}
      />
    </div>
  );
};

export default KoulutusalatField;
