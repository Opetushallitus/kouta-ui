import { useEffect } from 'react';

import Box from '@opetushallitus/virkailija-ui-components/Box';
import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput } from '#/src/components/formFields';
import OpintojenLaajuusFieldExtended from '#/src/components/OpintojenLaajuusFieldExtended';
import { KOULUTUSTYYPPI, KOULUTUS_PERUSOPETUS_KOODIURI } from '#/src/constants';
import { useBoundFormActions, useFieldValue } from '#/src/hooks/form';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import {
  getKoulutustyyppiTranslationKey,
  isIn,
  otherwise,
  getTestIdProps,
} from '#/src/utils';

import AmmOpettajaKoulutusTiedotSubSection from './AmmOpettajaKoulutusTiedotSubSection';
import EnforcedKoulutusSelect from './EnforcedKoulutusSelect';
import KoulutusalatField from './KoulutusalatField';
import OpintojenlaajuusField from './OpintojenlaajuusField';

export const TutkintoonjohtamattomatTiedotSection = ({
  disabled,
  language,
  name,
  koulutustyyppi,
}) => {
  const { t } = useTranslation();
  const koulutustyyppiKey = getKoulutustyyppiTranslationKey(koulutustyyppi);
  const { change } = useBoundFormActions();
  const currNimi = useFieldValue(`${name}.nimi`);
  const nimiDisabled =
    !useIsOphVirkailija() ||
    [KOULUTUSTYYPPI.TELMA, KOULUTUSTYYPPI.TUVA].includes(koulutustyyppi);
  const defaultNimiShouldBeUsed = [
    KOULUTUSTYYPPI.TUVA,
    KOULUTUSTYYPPI.TELMA,
    KOULUTUSTYYPPI.AIKUISTEN_PERUSOPETUS,
  ].includes(koulutustyyppi);

  const koulutusAlatAvailable = [
    KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OPISTOVUOSI,
    KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_MUU,
    KOULUTUSTYYPPI.MUU_AMMATILLINEN_KOULUTUS,
  ].includes(koulutustyyppi);
  useEffect(() => {
    if (_fp.isUndefined(currNimi) && defaultNimiShouldBeUsed) {
      change(`${name}.nimi`, {
        fi: t(`${koulutustyyppiKey}`, { lng: 'fi' }),
        sv: t(`${koulutustyyppiKey}`, { lng: 'sv' }),
        en: t(`${koulutustyyppiKey}`, { lng: 'en' }),
      });
    }
  }, [change, currNimi, defaultNimiShouldBeUsed, koulutustyyppiKey, name, t]);

  return (
    <>
      {_fp.cond([
        [
          isIn([
            KOULUTUSTYYPPI.AMMATILLINEN_OPETTAJA_ERITYISOPETTAJA_JA_OPOKOULUTUS,
          ]),
          () => (
            <AmmOpettajaKoulutusTiedotSubSection
              disabled={disabled}
              name={name}
              language={language}
              koulutustyyppi={koulutustyyppi}
            />
          ),
        ],
        [
          otherwise,
          () => (
            <Box mb={-2}>
              {koulutustyyppi === KOULUTUSTYYPPI.AIKUISTEN_PERUSOPETUS && (
                <Box mb={2}>
                  <EnforcedKoulutusSelect
                    value={{ value: KOULUTUS_PERUSOPETUS_KOODIURI }}
                  />
                </Box>
              )}
              <Box mb={2}>
                {_fp.cond([
                  [
                    isIn([
                      KOULUTUSTYYPPI.AIKUISTEN_PERUSOPETUS,
                      KOULUTUSTYYPPI.MUU_AMMATILLINEN_KOULUTUS,
                    ]),
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
                      <OpintojenlaajuusField
                        disabled={disabled}
                        name={name}
                        required
                      />
                    ),
                  ],
                ])(koulutustyyppi)}
              </Box>
              <Box mb={2}>
                {koulutusAlatAvailable && (
                  <KoulutusalatField disabled={disabled} name={name} />
                )}
              </Box>
              <Box mb={2} {...getTestIdProps('nimiInput')}>
                <Field
                  disabled={nimiDisabled}
                  name={`${name}.nimi.${language}`}
                  component={FormFieldInput}
                  label={t('koulutuslomake.koulutuksenNimi')}
                  helperText={t(
                    'koulutuslomake.koulutuksenNimiNakyyOppijalleVaroitus'
                  )}
                  required
                />
              </Box>
            </Box>
          ),
        ],
      ])(koulutustyyppi)}
    </>
  );
};
