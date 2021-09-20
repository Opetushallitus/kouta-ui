import React, { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput, FormFieldSwitch } from '#/src/components/formFields';
import { Box, FormControl, Input } from '#/src/components/virkailija';
import { KOULUTUSTYYPPI } from '#/src/constants';
import { useBoundFormActions } from '#/src/hooks/form';
import useKoodi from '#/src/hooks/useKoodi';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { getTestIdProps } from '#/src/utils';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';

export const TuvaTelmaTiedotSection = ({ language, name, koulutus }) => {
  const { t } = useTranslation();

  const { koodi: laajuusKoodi } = useKoodi(
    koulutus.metadata.opintojenLaajuusKoodiUri
  );

  const { koodi: laajuusYksikko } = useKoodi('opintojenlaajuusyksikko_6');

  const userLanguage = useUserLanguage();
  const koulutustyyppi = koulutus.koulutustyyppi;
  const { change } = useBoundFormActions();
  useEffect(() => {
    change(`${name}.nimi`, {
      fi: t(`koulutustyypit.${koulutustyyppi}`, { lng: 'fi' }),
      sv: t(`koulutustyypit.${koulutustyyppi}`, { lng: 'sv' }),
      en: t(`koulutustyypit.${koulutustyyppi}`, { lng: 'en' }),
    });
    return () => change(`${name}.nimi`, {});
  }, [change, koulutustyyppi, name, t]);

  let toteutuksenLaajuus = getKoodiNimiTranslation(laajuusKoodi, userLanguage);

  if (koulutus.koulutustyyppi === KOULUTUSTYYPPI.TELMA) {
    toteutuksenLaajuus =
      toteutuksenLaajuus +
      ` ${getKoodiNimiTranslation(laajuusYksikko, userLanguage)}`;
  }

  return (
    <>
      <Box mb={2} {...getTestIdProps('toteutuksenNimi')}>
        <Field
          name={`${name}.nimi.${language}`}
          component={FormFieldInput}
          label={t('toteutuslomake.toteutuksenNimi')}
          required
          disabled
        />
      </Box>
      <Box mb={2} display="flex">
        <Box>
          <FormControl label={t('toteutuslomake.laajuus')} disabled={true}>
            <Input
              value={toteutuksenLaajuus || ''}
              {...getTestIdProps('laajuus')}
            />
          </FormControl>
        </Box>
        <Box mx={2} {...getTestIdProps('aloituspaikat')}>
          <Field
            name={`${name}.aloituspaikat`}
            component={FormFieldInput}
            label={t('toteutuslomake.aloituspaikat')}
            type="number"
          />
        </Box>
      </Box>
      <Box mb={2}>
        <Field
          name={`${name}.jarjestetaanErityisopetuksena`}
          component={FormFieldSwitch}
        >
          {t('toteutuslomake.jarjestetaanErityisopetuksena')}
        </Field>
      </Box>
    </>
  );
};
