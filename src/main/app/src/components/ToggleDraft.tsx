import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFieldValue } from '#/src/hooks/form';
import { FormFieldCheckbox } from './formFields';
import { Field } from 'redux-form';
import { useIsOphVirkailija } from '../hooks/useIsOphVirkailija';

export const ToggleDraft = () => {
  const { t } = useTranslation();

  const isOphVirkailija = useIsOphVirkailija();

  const esikatselu = useFieldValue('esikatselu');

  return esikatselu !== undefined && isOphVirkailija ? (
    <Field name={'esikatselu'} component={FormFieldCheckbox}>
      {t('yleiset.salliEsikatselu')}
    </Field>
  ) : null;
};

export default ToggleDraft;
