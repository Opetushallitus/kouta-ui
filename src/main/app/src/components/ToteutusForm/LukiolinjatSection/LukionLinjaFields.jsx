import React from 'react';
import { Field } from 'redux-form';

import { FormFieldSelect } from '../../FormFields';
import useKoodistoOptions from '../../useKoodistoOptions';
import useTranslation from '../../useTranslation';
import { getTestIdProps } from '../../../utils';

const LukionLinjaFields = ({ name }) => {
  const { t } = useTranslation();

  const { options } = useKoodistoOptions({
    koodisto: 'lukiolinjat',
  });

  return (
    <div {...getTestIdProps('linja')}>
      <Field
        component={FormFieldSelect}
        name={`${name}.linja`}
        label={t('toteutuslomake.valitseLukioLinja')}
        options={options}
      />
    </div>
  );
};

export default LukionLinjaFields;
