import React, { useEffect } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput } from '#/src/components/formFields';
import OpintojenLaajuusFieldExtended from '#/src/components/OpintojenLaajuusFieldExtended';
import { Box } from '#/src/components/virkailija';
import { KOULUTUSTYYPPI } from '#/src/constants';
import { useBoundFormActions } from '#/src/hooks/form';
import {
  isIn,
  otherwise,
  getKoulutustyyppiTranslationKey,
  getTestIdProps,
} from '#/src/utils';

import EnforcedKoulutusSelection from './EnforcedKoulutusSelection';
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
      fi: t(`${koulutustyyppiKey}`, { lng: 'fi' }),
      sv: t(`${koulutustyyppiKey}`, { lng: 'sv' }),
      en: t(`${koulutustyyppiKey}`, { lng: 'en' }),
    });

    return () => change('information.nimi', {});
  }, [change, koulutustyyppiKey, t]);

  // TBD
  // Lisää tämä ensimmäiseksi ylätason boxin alle:
  // {koulutustyyppi === KOULUTUSTYYPPI.AIKUISTEN_PERUSOPETUS && (
  //  <Box mb={2}>
  //    <EnforcedKoulutusSelection
  //      name={name}
  //      koulutusKoodiUri="koulutus_201101"
  //    />
  //  </Box>
  // )}

  return (
    <Box mb={-2}>
      <Box mb={2} {...getTestIdProps('opintojenlaajuusSelect')}>
        {_fp.cond([
          [
            isIn([KOULUTUSTYYPPI.AIKUISTEN_PERUSOPETUS]),
            () => (
              <OpintojenLaajuusFieldExtended
                name={name}
                disabled={disabled}
                required
              />
            ),
          ],
          [
            otherwise,
            () => (
              <OpintojenlaajuusField disabled={disabled} name={name} required />
            ),
          ],
        ])(koulutustyyppi)}{' '}
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
