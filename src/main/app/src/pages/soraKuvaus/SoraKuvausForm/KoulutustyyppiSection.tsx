import React, { useEffect } from 'react';
import _ from 'lodash';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';
import {
  FormFieldAsyncKoodistoSelect,
  FormFieldKoulutusalaSelect,
  FormFieldKoulutustyyppiSelect,
} from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import {
  useBoundFormActions,
  useFieldValue,
  useIsDirty,
} from '#/src/hooks/form';
import useLoadOptions from '#/src/hooks/useLoadOptions';
import { useKoodistoDataOptions } from '#/src/hooks/useKoodistoOptions';
import { useHasChanged } from '#/src/hooks/useHasChanged';
import { getTestIdProps } from '#/src/utils';
import { useKoulutuksetByKoulutusala } from '#/src/utils/soraKuvaus/getKoulutuksetBykoulutusala';

export const KoulutustyyppiSection = ({
  name,
  language,
  canEditKoulutustyyppi,
}) => {
  const { t } = useTranslation();

  const { change } = useBoundFormActions();

  const koulutusalaFieldValue = useFieldValue('koulutusala')?.value;

  const koulutusalaHasChanged = useHasChanged(koulutusalaFieldValue);

  const isDirty = useIsDirty();

  useEffect(() => {
    if (koulutusalaHasChanged && isDirty) {
      change('koulutukset', null);
    }
  }, [change, isDirty, koulutusalaHasChanged]);

  const { data: koulutukset } = useKoulutuksetByKoulutusala(
    koulutusalaFieldValue
  );

  const koulutusOptions = useKoodistoDataOptions({
    koodistoData: koulutukset,
    language,
  });

  const loadOptions = useLoadOptions(koulutusOptions);

  return (
    <Box display="flex" flexDirection="column" maxWidth="900px">
      <Field
        name={name}
        component={FormFieldKoulutustyyppiSelect}
        label={t('yleiset.valitseKoulutustyyppi')}
        disabled={!canEditKoulutustyyppi}
      />
      <Box display="flex" mt={4}>
        <Box flex="1 1 50%" mr={2} {...getTestIdProps('koulutusala')}>
          <Field
            name="koulutusala"
            component={FormFieldKoulutusalaSelect}
            label={t('soraKuvauslomake.valitseKoulutusala')}
          />
        </Box>
        <Box flex="1 1 50%" {...getTestIdProps('koulutukset')}>
          <Field
            name="koulutukset"
            loadOptions={loadOptions}
            component={FormFieldAsyncKoodistoSelect}
            label={t('yleiset.valitseKoulutus')}
            disabled={_.isEmpty(koulutusOptions)}
            language={language}
            isMulti={true}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default KoulutustyyppiSection;
