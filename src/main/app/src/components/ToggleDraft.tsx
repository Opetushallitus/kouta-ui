import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { useFieldValue } from '#/src/hooks/form';

import { useIsOphVirkailija } from '../hooks/useIsOphVirkailija';
import { FormFieldCheckbox } from './formFields';

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
