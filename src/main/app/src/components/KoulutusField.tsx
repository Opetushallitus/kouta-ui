import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldAsyncKoodistoSelect } from '#/src/components/formFields';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import useLoadOptions from '#/src/hooks/useLoadOptions';

const KoulutusField = props => {
  const { language } = props;
  const { options, isLoading } = useKoodistoOptions({
    koodisto: 'koulutus',
    language,
  });
  const loadOptions = useLoadOptions(options);
  const { t } = useTranslation();

  return (
    <Field
      isLoading={isLoading}
      loadOptions={loadOptions}
      component={FormFieldAsyncKoodistoSelect}
      label={t('yleiset.valitseKoulutus')}
      {...props}
    />
  );
};

export default KoulutusField;
