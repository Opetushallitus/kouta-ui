import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldSelect } from '#/src/components/formFields';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';

export const TaiteenalatField = ({
  disabled = false,
  required = false,
  name,
}) => {
  const { t } = useTranslation();
  const selectedLanguage = useLanguageTab();

  let { options } = useKoodistoOptions({
    koodisto: 'taiteenperusopetustaiteenala',
    language: selectedLanguage,
  });

  return (
    <div {...getTestIdProps('taiteenalatSelect')}>
      <Field
        disabled={disabled}
        required={required}
        isMulti={true}
        name={`${name}.taiteenalat`}
        component={FormFieldSelect}
        options={options}
        label={t('toteutuslomake.valitseTaiteenalat')}
      />
    </div>
  );
};