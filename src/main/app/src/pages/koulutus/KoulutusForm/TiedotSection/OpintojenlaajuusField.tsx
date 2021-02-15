import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldSelect } from '#/src/components/formFields';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';

const useOpintojenLaajuusOptions = () => {
  const { options } = useKoodistoOptions({
    koodisto: 'opintojenlaajuus',
  });

  return useMemo(
    () =>
      options.filter(({ value }) => {
        const { koodiArvo } = parseKoodiUri(value);
        // Only show values starting with a number
        return /^\d/.test(koodiArvo);
      }),
    [options]
  );
};

export const OpintojenlaajuusField = ({ disabled, name }) => {
  const laajuusOptions = useOpintojenLaajuusOptions();

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
