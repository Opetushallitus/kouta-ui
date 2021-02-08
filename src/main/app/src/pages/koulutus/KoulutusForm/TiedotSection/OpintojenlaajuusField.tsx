import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldSelect } from '#/src/components/formFields';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';

export const OpintojenlaajuusField = ({ disabled, name }) => {
  const { options: laajuusOptions } = useKoodistoOptions({
    koodisto: 'opintojenlaajuus',
  });

  const { t } = useTranslation();

  return (
    <div {...getTestIdProps('opintojenLaajuusSelect')}>
      <Field
        disabled={disabled}
        name={`${name}.opintojenLaajuus`}
        component={FormFieldSelect}
        options={laajuusOptions}
        label={t('koulutuslomake.valitseOpintojenLaajuus')}
      />
    </div>
  );
};

export default OpintojenlaajuusField;
