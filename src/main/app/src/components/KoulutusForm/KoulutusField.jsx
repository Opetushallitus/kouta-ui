import React from 'react';
import { Field } from 'redux-form';

import { FormFieldAsyncKoodistoSelect } from '../formFields';
import useKoodistoOptions from '../useKoodistoOptions';
import useLoadOptions from '../useLoadOptions';
import useTranslation from '../useTranslation';

const KoulutusField = props => {
  const { language } = props;
  const { options } = useKoodistoOptions({ koodisto: 'koulutus', language });
  const loadOptions = useLoadOptions(options);
  const { t } = useTranslation();

  return (
    <Field
      loadOptions={loadOptions}
      component={FormFieldAsyncKoodistoSelect}
      label={t('koulutuslomake.valitseKoulutus')}
      {...props}
    />
  );
};

export default KoulutusField;
