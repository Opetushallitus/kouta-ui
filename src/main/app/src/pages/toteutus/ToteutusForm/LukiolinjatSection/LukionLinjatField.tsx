import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import { FormFieldSelect } from '#/src/components/formFields';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';

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
