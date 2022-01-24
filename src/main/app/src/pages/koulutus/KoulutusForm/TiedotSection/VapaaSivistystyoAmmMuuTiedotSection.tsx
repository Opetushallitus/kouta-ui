import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';

import KoulutusalatField from './KoulutusalatField';
import OpintojenlaajuusField from './OpintojenlaajuusField';

export const VapaaSivistystyoAmmMuuTiedotSection = ({
  disabled,
  language,
  name,
}) => {
  const { t } = useTranslation();
  return (
    <Box mb={-2}>
      <Box mb={2}>
        <OpintojenlaajuusField disabled={disabled} name={name} required />
      </Box>
      <Box mb={2}>
        <KoulutusalatField disabled={disabled} name={name} />
      </Box>
      <Box mb={2}>
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
