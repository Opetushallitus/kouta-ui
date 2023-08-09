import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldSelect } from '#/src/components/formFields';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';

export const TaiteenalatField = ({
  disabled = false,
  required = false,
  name,
}) => {
  const { t } = useTranslation();
  const selectedLanguage = useLanguageTab();

  const { options } = useKoodistoOptions({
    koodisto: 'taiteenperusopetustaiteenala',
    language: selectedLanguage,
  });

  return (
    <Field
      disabled={disabled}
      required={required}
      isMulti={true}
      name={`${name}.taiteenalat`}
      component={FormFieldSelect}
      options={options}
      label={t('toteutuslomake.valitseTaiteenalat')}
    />
  );
};
