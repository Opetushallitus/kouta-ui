import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import { FormFieldAsyncKoodistoSelect } from '#/src/components/formFields';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import useLoadOptions from '#/src/hooks/useLoadOptions';

const KoulutusField = props => {
  const { language, disabled } = props;
  const { options } = useKoodistoOptions({ koodisto: 'koulutus', language });
  const loadOptions = useLoadOptions(options);
  const { t } = useTranslation();

  return (
    <Field
      disabled={disabled}
      loadOptions={loadOptions}
      component={FormFieldAsyncKoodistoSelect}
      label={t('koulutuslomake.valitseKoulutus')}
      {...props}
    />
  );
};

export default KoulutusField;
