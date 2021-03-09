import React, { useEffect } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldAsyncKoodistoSelect } from '#/src/components/formFields';
import { useKoodistoDataOptions } from '#/src/hooks/useKoodistoOptions';
import { useKoulutuksetByKoulutustyyppi } from '#/src/utils/koulutus/getKoulutuksetByKoulutustyyppi';

import { useBoundFormActions, useFieldValue, useIsDirty } from '../hooks/form';
import { useHasChanged } from '../hooks/useHasChanged';
import useLoadOptions from '../hooks/useLoadOptions';

const KoulutusField = props => {
  const { language, name } = props;

  const koulutustyyppi = useFieldValue('koulutustyyppi');

  const { data: koulutukset, isLoading } = useKoulutuksetByKoulutustyyppi(
    koulutustyyppi
  );

  const options = useKoodistoDataOptions({
    koodistoData: koulutukset,
    language,
  });

  const loadOptions = useLoadOptions(options);

  const { t } = useTranslation();

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
      loadOptions={loadOptions}
      component={FormFieldAsyncKoodistoSelect}
      disabled={_.isEmpty(options)}
      label={t('yleiset.valitseKoulutus')}
      defaultOptions={options}
      {...props}
    />
  );
};

export default KoulutusField;
