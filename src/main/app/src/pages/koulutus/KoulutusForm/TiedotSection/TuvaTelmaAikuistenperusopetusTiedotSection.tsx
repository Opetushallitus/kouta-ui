import React, { useEffect } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput } from '#/src/components/formFields';
import OpintojenLaajuusFieldExtended from '#/src/components/OpintojenLaajuusFieldExtended';
import { Box } from '#/src/components/virkailija';
import { KOULUTUSTYYPPI, KOULUTUS_PERUSOPETUS_KOODIURI } from '#/src/constants';
import { useBoundFormActions, useFieldValue } from '#/src/hooks/form';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import {
  isIn,
  otherwise,
  getKoulutustyyppiTranslationKey,
  getTestIdProps,
} from '#/src/utils';

import EnforcedKoulutusSelect from './EnforcedKoulutusSelect';
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
  const currNimi = useFieldValue(`${name}.nimi`);
  useEffect(() => {
    if (_fp.isUndefined(currNimi)) {
      change(`${name}.nimi`, {
        fi: t(`${koulutustyyppiKey}`, { lng: 'fi' }),
        sv: t(`${koulutustyyppiKey}`, { lng: 'sv' }),
        en: t(`${koulutustyyppiKey}`, { lng: 'en' }),
      });
    }
  }, [change, currNimi, koulutustyyppiKey, name, t]);

  const nimiDisabled = !useIsOphVirkailija();
  return (
    <Box mb={-2}>
      {koulutustyyppi === KOULUTUSTYYPPI.AIKUISTEN_PERUSOPETUS && (
        <Box mb={2}>
          <EnforcedKoulutusSelect
            value={{ value: KOULUTUS_PERUSOPETUS_KOODIURI }}
          />
        </Box>
      )}
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
        ])(koulutustyyppi)}
      </Box>
      <Box mb={2} {...getTestIdProps('nimiInput')}>
        <Field
          disabled={nimiDisabled}
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
