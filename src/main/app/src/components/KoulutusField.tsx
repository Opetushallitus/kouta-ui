import React, { useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { FormFieldAsyncKoodistoSelect } from '#/src/components/formFields';
import { Field } from '#/src/components/formFields/Field';
import { KOULUTUSTYYPPI } from '#/src/constants';
import {
  useBoundFormActions,
  useIsDirty,
  useKoulutusFormField,
} from '#/src/hooks/form';
import { useHasChanged } from '#/src/hooks/useHasChanged';
import { useKoulutuksetByKoulutustyyppi } from '#/src/hooks/useKoulutuksetByKoulutustyyppi';
import { formatKoodiLabelWithArvo } from '#/src/utils';

const KoulutusField = props => {
  const { t } = useTranslation();
  const {
    name,
    isMultiSelect = false,
    valitseKoulutusLabel = t('yleiset.valitseKoulutus'),
  } = props;

  const koulutustyyppi = useKoulutusFormField('koulutustyyppi');

  const { data: koulutukset, isLoading } = useKoulutuksetByKoulutustyyppi(
    koulutustyyppi as KOULUTUSTYYPPI
  );

  const koulutustyyppiChanged = useHasChanged(koulutustyyppi);

  const { change } = useBoundFormActions();

  const isDirty = useIsDirty();

  useEffect(() => {
    if (isDirty && koulutustyyppiChanged) {
      change(name, null);
    }
  }, [isDirty, koulutustyyppiChanged, change, name]);

  return (
    <Field
      isLoading={isLoading}
      component={FormFieldAsyncKoodistoSelect}
      koodistoData={koulutukset}
      label={valitseKoulutusLabel}
      showAllOptions={true}
      isMulti={isMultiSelect}
      formatKoodiLabel={formatKoodiLabelWithArvo}
      {...props}
    />
  );
};

export default KoulutusField;
