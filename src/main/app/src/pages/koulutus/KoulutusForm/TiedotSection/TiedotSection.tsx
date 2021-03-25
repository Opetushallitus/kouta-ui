import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import FormConfigFragment from '#/src/components/FormConfigFragment';
import { FormFieldInput } from '#/src/components/formFields';
import KoulutusField from '#/src/components/KoulutusField';
import { Box } from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';

import { useNimiFromKoulutusKoodi } from '../useNimiFromKoulutusKoodi';
import KoulutuksenTiedotSection from './KoulutuksenTiedotSection';
import KoulutusalatField from './KoulutusalatField';
import OpintojenlaajuusField from './OpintojenlaajuusField';
import TutkintonimikeField from './TutkintonimikeField';

export const TiedotSection = ({
  disabled,
  language,
  koulutustyyppi,
  koulutuskoodi,
  name,
}) => {
  const { t } = useTranslation();

  useNimiFromKoulutusKoodi({
    nimiFieldName: `${name}.nimi`,
    koulutusFieldName: `${name}.koulutus`,
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

      <FormConfigFragment name="koulutuskooditKorkeakouluille">
        <Box mb={2} {...getTestIdProps('korkeaoulutuskoodiSelect')}>
          <KoulutusField
            disabled={disabled}
            name={`${name}.korkeakoulutukset`}
            koulutustyyppi={koulutustyyppi}
            language={language}
            isMultiSelect={true}
            valitseKoulutusLabel={t('yleiset.valitseKoulutukset')}
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
