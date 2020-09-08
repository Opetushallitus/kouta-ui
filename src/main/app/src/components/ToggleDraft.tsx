import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import FormConfigSectionContext from '#/src/contexts/FormConfigSectionContext';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';

import { FormFieldCheckbox } from './formFields';

export const ToggleDraft = () => {
  const { t } = useTranslation();

  const isOphVirkailija = useIsOphVirkailija();

  return isOphVirkailija ? (
    <FormConfigSectionContext.Provider value="esikatselu">
      <Field name="esikatselu" component={FormFieldCheckbox}>
        {t('yleiset.salliEsikatselu')}
      </Field>
    </FormConfigSectionContext.Provider>
  ) : null;
};
