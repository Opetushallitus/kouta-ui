import React from 'react';
import { Field } from 'redux-form';

import useKoodistoOptions from '../../useKoodistoOptions';
import useTranslation from '../../useTranslation';
import { getTestIdProps } from '../../../utils';

import { FormFieldSelect } from '../../formFields';

export const OpintojenlaajuusField = ({ name }) => {
  const { options: laajuusOptions } = useKoodistoOptions({
    koodisto: 'opintojenlaajuus',
  });

  const { t } = useTranslation();

  return (
    <div {...getTestIdProps('opintojenLaajuusSelect')}>
      <Field
        name={`${name}.opintojenLaajuus`}
        component={FormFieldSelect}
        options={laajuusOptions}
        label={t('koulutuslomake.valitseOpintojenLaajuus')}
      />
    </div>
  );
};

export default OpintojenlaajuusField;
