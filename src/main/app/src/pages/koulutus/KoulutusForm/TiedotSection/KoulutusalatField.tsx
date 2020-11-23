import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import { FormFieldKoulutusalaSelect } from '#/src/components/formFields';
import { getTestIdProps } from '#/src/utils';

export const KoulutusalatField = ({ disabled, name }) => {
  const { t } = useTranslation();

  return (
    <div {...getTestIdProps('koulutusalatSelect')}>
      <Field
        disabled={disabled}
        name={`${name}.koulutusalat`}
        component={FormFieldKoulutusalaSelect}
        label={t('koulutuslomake.valitseKoulutusalat')}
        isMulti={true}
      />
    </div>
  );
};

export default KoulutusalatField;
