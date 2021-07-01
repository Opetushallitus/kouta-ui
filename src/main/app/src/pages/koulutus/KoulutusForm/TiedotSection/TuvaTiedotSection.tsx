import React, { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { useBoundFormActions } from '#/src/hooks/form';
import { getTestIdProps } from '#/src/utils';

import OpintojenlaajuusField from './OpintojenlaajuusField';

export const TuvaTiedotSection = ({ disabled, language, name }) => {
  const { t } = useTranslation();

  const { change } = useBoundFormActions();
  useEffect(() => {
    change('information.nimi', {
      fi: t('koulutustyypit.tuva', { lng: 'fi' }),
      sv: t('koulutustyypit.tuva', { lng: 'sv' }),
      en: t('koulutustyypit.tuva', { lng: 'en' }),
    });

    return () => change('information.nimi', {});
  }, [change, t]);

  return (
    <Box mb={-2}>
      <Box mb={2} {...getTestIdProps('tuvaOpintojenlaajuusSelect')}>
        <OpintojenlaajuusField
          disabled={disabled}
          name={name}
          required={true}
        />
      </Box>
      <Box mb={2} {...getTestIdProps('nimiInput')}>
        <Field
          disabled={true}
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
