import React, { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldAsyncKoodistoSelect } from '#/src/components/formFields';
import {
  useBoundFormActions,
  useFieldValue,
  useIsDirty,
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

  const koulutustyyppi = useFieldValue('koulutustyyppi');

  const { data: koulutukset, isLoading } =
    useKoulutuksetByKoulutustyyppi(koulutustyyppi);

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
