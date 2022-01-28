import React, { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { useBoundFormActions } from '#/src/hooks/form';
import { getKoulutustyyppiTranslationKey, getTestIdProps } from '#/src/utils';

import OpintojenlaajuusField from './OpintojenlaajuusField';

export const TuvaTelmaAikuistenperusopetusTiedotSection = ({
  disabled,
  language,
  name,
  koulutustyyppi,
}) => {
  const { t } = useTranslation();
  const koulutustyyppiKey = getKoulutustyyppiTranslationKey(koulutustyyppi);
  const { change } = useBoundFormActions();
  useEffect(() => {
    change('information.nimi', {
      fi: t(`koulutustyypit.${koulutustyyppiKey}`, { lng: 'fi' }),
      sv: t(`koulutustyypit.${koulutustyyppiKey}`, { lng: 'sv' }),
      en: t(`koulutustyypit.${koulutustyyppiKey}`, { lng: 'en' }),
    });

    return () => change('information.nimi', {});
  }, [change, koulutustyyppiKey, t]);

  return (
    <Box mb={-2}>
      <Box mb={2} {...getTestIdProps('opintojenlaajuusSelect')}>
        <OpintojenlaajuusField disabled={disabled} name={name} required />
      </Box>
      <Box mb={2} {...getTestIdProps('nimiInput')}>
        <Field
          disabled
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
