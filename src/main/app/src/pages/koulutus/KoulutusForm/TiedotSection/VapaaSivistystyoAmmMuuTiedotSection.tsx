import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput } from '#/src/components/formFields';
import OpintojenLaajuusFieldExtended from '#/src/components/OpintojenLaajuusFieldExtended';
import { Box } from '#/src/components/virkailija';

import KoulutusalatField from './KoulutusalatField';
import OpintojenlaajuusField from './OpintojenlaajuusField';

export const VapaaSivistystyoTiedotSection = ({ disabled, language, name }) => {
  const { t } = useTranslation();
  return (
    <Box>
      <Box mb={2}>
        <OpintojenlaajuusField disabled={disabled} name={name} required />
      </Box>
      <Box mb={2}>
        <KoulutusalatField disabled={disabled} name={name} />
      </Box>
      <Box>
        <Field
          disabled={disabled}
          name={`${name}.nimi.${language}`}
          component={FormFieldInput}
          label={t('koulutuslomake.koulutuksenNimi')}
          helperText={t('koulutuslomake.koulutuksenNimiNakyyOppijalleVaroitus')}
          required
        />
      </Box>
    </Box>
  );
};

export const AmmMuuTiedotSection = ({ disabled, language, name }) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Box mb={2}>
        <OpintojenLaajuusFieldExtended
          name={name}
          disabled={disabled}
          required
        />
      </Box>
      <Box mb={2}>
        <KoulutusalatField disabled={disabled} name={name} />
      </Box>
      <Box>
        <Field
          disabled={disabled}
          name={`${name}.nimi.${language}`}
          component={FormFieldInput}
          label={t('koulutuslomake.koulutuksenNimi')}
          helperText={t('koulutuslomake.koulutuksenNimiNakyyOppijalleVaroitus')}
          required
        />
      </Box>
    </Box>
  );
};
