import React from 'react';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import FormConfigFragment from '#/src/components/FormConfigFragment';
import { FormFieldInput } from '#/src/components/formFields';
import { getTestIdProps } from '#/src/utils';
import { Box } from '#/src/components/virkailija';
import KoulutusField from '../KoulutusField';
import { useLocalizedKoulutus } from '../useLocalizedKoulutus';
import KoulutuksenTiedotSection from './KoulutuksenTiedotSection';
import KoulutusalatField from './KoulutusalatField';
import OpintojenlaajuusField from './OpintojenlaajuusField';
import TutkintonimikeField from './TutkintonimikeField';

const TiedotSection = ({
  disabled,
  language,
  koulutustyyppi,
  koulutuskoodi,
  name,
}) => {
  const { t } = useTranslation();

  useLocalizedKoulutus({
    nimiFieldName: `${name}.nimi`,
    koulutusFieldName: `${name}.koulutus`,
    language,
  });

  return (
    <Box mb={-2}>
      <FormConfigFragment name="koulutuskoodiTiedoilla">
        <Box mb={2}>
          <KoulutuksenTiedotSection
            disabled={disabled}
            language={language}
            koulutuskoodi={koulutuskoodi}
            koulutustyyppi={koulutustyyppi}
            name={name}
          />
        </Box>
      </FormConfigFragment>

      <FormConfigFragment name="osaamisala">
        <Box mb={2}>
          <KoulutuksenTiedotSection
            disabled={disabled}
            language={language}
            koulutuskoodi={koulutuskoodi}
            koulutustyyppi={koulutustyyppi}
            selectLabel={t('koulutuslomake.valitseOsaamisala')}
            name={name}
          />
        </Box>
      </FormConfigFragment>

      <FormConfigFragment name="koulutuskoodi">
        <Box mb={2} {...getTestIdProps('koulutuskoodiSelect')}>
          <KoulutusField
            disabled={disabled}
            name={`${name}.koulutus`}
            koulutustyyppi={koulutustyyppi}
            language={language}
          />
        </Box>
      </FormConfigFragment>

      <Box mb={2}>
        <OpintojenlaajuusField disabled={disabled} name={name} />
      </Box>

      <Box mb={2}>
        <TutkintonimikeField disabled={disabled} name={name} />
      </Box>

      <Box mb={2}>
        <KoulutusalatField disabled={disabled} name={name} />
      </Box>

      <Box mb={2} {...getTestIdProps('nimiInput')}>
        <Field
          disabled={disabled}
          name={`${name}.nimi.${language}`}
          component={FormFieldInput}
          label={t('koulutuslomake.muokkaaKoulutuksenNimea')}
        />
      </Box>
    </Box>
  );
};

export default TiedotSection;
