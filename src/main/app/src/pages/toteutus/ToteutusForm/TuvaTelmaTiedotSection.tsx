import React, { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput, FormFieldSwitch } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { KOULUTUSTYYPPI } from '#/src/constants';
import { useBoundFormActions } from '#/src/hooks/form';
import useKoodi from '#/src/hooks/useKoodi';
import { getTestIdProps } from '#/src/utils';
import { getOpintojenLaajuusTranslations } from '#/src/utils/getOpintojenLaajuusTranslations';

export const TuvaTelmaTiedotSection = ({ language, name, koulutus }) => {
  const { t } = useTranslation();

  const { koodi: laajuusKoodi } = useKoodi(
    koulutus.metadata.opintojenLaajuusKoodiUri
  );
  const { koodi: laajuusyksikko } = useKoodi('opintojenlaajuusyksikko_6');
  const laajuusKoodiNimet = laajuusKoodi?.metadata;
  const laajuusyksikkoNimet = laajuusyksikko?.metadata;

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

  useEffect(() => {
    change(
      `${name}.laajuus`,
      getOpintojenLaajuusTranslations(laajuusKoodiNimet, laajuusyksikkoNimet)
    );
    return () => change(`${name}.laajuus`, {});
  }, [change, laajuusKoodiNimet, laajuusyksikkoNimet, name, t]);

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
          <Field
            name={`${name}.laajuus.${language}`}
            component={FormFieldInput}
            label={t('toteutuslomake.laajuus')}
            required
            disabled
          />
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
        {koulutustyyppi !== KOULUTUSTYYPPI.TELMA && (
          <Field
            name={`${name}.jarjestetaanErityisopetuksena`}
            component={FormFieldSwitch}
          >
            {t('toteutuslomake.jarjestetaanErityisopetuksena')}
          </Field>
        )}
      </Box>
    </>
  );
};
