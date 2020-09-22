import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldArray } from 'redux-form';
import Button from '#/src/components/Button';
import FieldArrayList from '#/src/components/FieldArrayList';
import FormConfigFragment from '#/src/components/FormConfigFragment';
import { Box } from '#/src/components/virkailija';
import { useFieldValue } from '#/src/hooks/form';
import { getTestIdProps } from '#/src/utils';
import KoulutuksenTiedotSection from './TiedotSection/KoulutuksenTiedotSection';
import { useLocalizedKoulutus } from './useLocalizedKoulutus';

const TutkinnonOsatField = ({ disabled, language, koulutustyyppi, name }) => {
  const { t } = useTranslation();
  const koulutuskoodi = useFieldValue(`${name}.koulutus`);

  useLocalizedKoulutus({
    nimiFieldName: `${name}.nimi`,
    koulutusFieldName: `${name}.koulutus`,
    language,
  });
  return (
    <Box mt={2}>
      <KoulutuksenTiedotSection
        disabled={disabled}
        language={language}
        koulutuskoodi={koulutuskoodi}
        koulutustyyppi={koulutustyyppi}
        name={name}
        selectLabel={t('koulutuslomake.valitseKoulutus')}
      />
    </Box>
  );
};

const TutkinnonOsatFields = ({
  disabled,
  language,
  koulutustyyppi,
  fields,
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
            koulutustyyppi={koulutustyyppi}
            name={field}
          />
        )}
      </FieldArrayList>
      <Box
        display="flex"
        justifyContent="center"
        mt={fields.length > 0 ? 4 : 0}
      >
        <Button
          variant="outlined"
          color="primary"
          type="button"
          onClick={onAddField}
          {...getTestIdProps('lisaaKoulutusButton')}
        >
          {t('toteutuslomake.lisaaKoulutus')}
        </Button>
      </Box>
    </>
  );
};

export const TutkinnonOsatSection = ({
  disabled,
  language,
  koulutustyyppi,
  name,
}) => {
  const { t } = useTranslation();

  return (
    <Box mb={-2}>
      <FormConfigFragment name="osat">
        <Box mb={2}>
          <FieldArray
            disabled={disabled}
            koulutustyyppi={koulutustyyppi}
            name={name}
            component={TutkinnonOsatFields}
            t={t}
            language={language}
          />
        </Box>
      </FormConfigFragment>
    </Box>
  );
};
