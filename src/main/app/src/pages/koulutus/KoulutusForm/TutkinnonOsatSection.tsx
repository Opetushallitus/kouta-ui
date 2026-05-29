import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { FieldArray, FieldArrayFieldsProps } from 'redux-form';

import FieldArrayList from '#/src/components/FieldArrayList';
import { FormButton } from '#/src/components/FormButton';
import { Box } from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';

import { WithKoulutusSelect } from './AmmatillinenTiedotSection/AmmatillinenTiedotSection';
import { EPerusteTiedot } from './AmmatillinenTiedotSection/EPerusteTiedot';
import { useNimiFromKoulutusKoodi } from './useNimiFromKoulutusKoodi';

const TutkinnonOsatField = ({
  disabled,
  language,
  name,
}: {
  disabled: boolean;
  language: LanguageCode;
  name: string;
}) => {
  useNimiFromKoulutusKoodi({
    nimiFieldName: `${name}.nimi`,
    koulutusFieldName: `${name}.koulutus`,
  });

  return (
    <Box mt={2}>
      <WithKoulutusSelect name={name}>
        {({ koulutus }) => (
          <EPerusteTiedot
            disabled={disabled}
            language={language}
            name={name}
            selectedKoulutus={koulutus}
          />
        )}
      </WithKoulutusSelect>
    </Box>
  );
};

const TutkinnonOsatFields = ({
  disabled,
  language,
  fields,
}: {
  disabled: boolean;
  language: LanguageCode;
  fields: FieldArrayFieldsProps<unknown>;
}) => {
  const { t } = useTranslation();
  const onAddField = useCallback(() => {
    fields.push({});
  }, [fields]);

  return (
    <>
      <FieldArrayList fields={fields}>
        {({ field }) => (
          <TutkinnonOsatField
            disabled={disabled}
            language={language}
            name={field}
          />
        )}
      </FieldArrayList>
      <Box
        display="flex"
        justifyContent="center"
        mt={fields.length > 0 ? 4 : 0}
      >
        <FormButton
          variant="outlined"
          color="primary"
          type="button"
          onClick={onAddField}
          {...getTestIdProps('lisaaKoulutusButton')}
        >
          {t('koulutuslomake.lisaaKoulutus')}
        </FormButton>
      </Box>
    </>
  );
};

export const TutkinnonOsatSection = ({
  disabled,
  language,
  name,
}: {
  disabled: boolean;
  language: LanguageCode;
  name: string;
}) => {
  return (
    <Box mb={-2}>
      <Box mb={2}>
        <FieldArray
          disabled={disabled}
          component={TutkinnonOsatFields}
          name={name}
          language={language}
        />
      </Box>
    </Box>
  );
};
