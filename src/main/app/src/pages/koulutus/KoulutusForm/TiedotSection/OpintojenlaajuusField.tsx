import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';

import { FormFieldSelect } from '#/src/components/formFields';

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
