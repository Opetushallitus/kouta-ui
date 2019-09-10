import React from 'react';
import { Field } from 'redux-form';

import { FormFieldSelect } from '../../FormFields';
import useKoodistoOptions from '../../useKoodistoOptions';
import useTranslation from '../../useTranslation';
import { getTestIdProps } from '../../../utils';

const LukiolinjatField = ({ name }) => {
  const { t } = useTranslation();

  const { options } = useKoodistoOptions({
    koodisto: 'lukiolinjat2',
  });

  return (
    <div {...getTestIdProps('lukionLinjanTarkenteet')}>
      <Field
        component={FormFieldSelect}
        name={name}
        label={t('toteutuslomake.valitseLukionLinjanTarkenteet')}
        options={options}
        isMulti
      />
    </div>
  );
};

export default LukiolinjatField;
