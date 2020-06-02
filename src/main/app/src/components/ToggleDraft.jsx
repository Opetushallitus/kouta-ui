import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useAuthorizedUserRoleBuilder from './useAuthorizedUserRoleBuilder';
import { HAKU_ROLE, OPETUSHALLITUS_ORGANISAATIO_OID } from '../constants';
import { useFieldValue } from '../hooks/form';
import { FormFieldCheckbox } from './formFields';
import { Field } from 'redux-form';

export const ToggleDraft = () => {
  const { t } = useTranslation();
  const roleBuilder = useAuthorizedUserRoleBuilder();

  const isOphVirkailija = useMemo(
    () =>
      roleBuilder
        .hasUpdate(HAKU_ROLE, OPETUSHALLITUS_ORGANISAATIO_OID)
        .result(),
    [roleBuilder]
  );
  const esikatselu = useFieldValue('esikatselu');

  return esikatselu !== undefined && isOphVirkailija ? (
    <Field name={'esikatselu'} component={FormFieldCheckbox}>
      {t('yleiset.salliEsikatselu')}
    </Field>
  ) : null;
};

export default ToggleDraft;
