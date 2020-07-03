import React from 'react';
import { Field } from 'redux-form';

import { FormFieldSelect } from '../../formFields';
import useKoodistoOptions from '../../useKoodistoOptions';
import { useTranslation } from 'react-i18next';
import { getTestIdProps } from '../../../utils';

const LukiolinjatField = ({ name }) => {
  const { t } = useTranslation();

  const { options } = useKoodistoOptions({
    koodisto: 'lukiolinjat',
  });

  return (
    <div {...getTestIdProps('lukiolinja')}>
      <Field
        component={FormFieldSelect}
        name={name}
        label={t('toteutuslomake.valitseLukiolinja')}
        options={options}
      />
    </div>
  );
};

export default LukiolinjatField;
