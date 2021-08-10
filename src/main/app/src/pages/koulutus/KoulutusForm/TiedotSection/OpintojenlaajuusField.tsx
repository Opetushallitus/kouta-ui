import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldSelect } from '#/src/components/formFields';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';

export const isValidOpintojenlaajuus = opintojenlaajuus => {
  return /(^\d)|(^v\d)/.test(opintojenlaajuus);
};

const useOpintojenLaajuusOptions = () => {
  const { options } = useKoodistoOptions({
    koodisto: 'opintojenlaajuus',
  });

  return useMemo(
    () =>
      options.filter(({ value }) => {
        const { koodiArvo } = parseKoodiUri(value);
        // Only show values starting with a number
        // ...or values starting with a single "v" followed by a number
        // to include "Vähintään 53 op" kind of values
        return isValidOpintojenlaajuus(koodiArvo);
      }),
    [options]
  );
};

export const OpintojenlaajuusField = ({ disabled, name, required }) => {
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
        required={required}
      />
    </div>
  );
};

export default OpintojenlaajuusField;
