import React, { useEffect } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput, FormFieldSwitch } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { KOULUTUSTYYPPI } from '#/src/constants';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import { useBoundFormActions, useFieldValue } from '#/src/hooks/form';
import { getTestIdProps } from '#/src/utils';

import { OpintojenLaajuusReadOnlyField } from './OpintojenLaajuusReadOnlyField';

export const TuvaTelmaAikuistenperusopetusTiedotSection = ({
  language,
  name,
  koulutus,
}) => {
  const { t } = useTranslation();
  const selectedLanguage = useLanguageTab();

  const opintojenLaajuusyksikkoKoodiUri =
    koulutus.koulutustyyppi === KOULUTUSTYYPPI.AIKUISTEN_PERUSOPETUS
      ? koulutus?.metadata?.opintojenLaajuusyksikkoKoodiUri
      : 'opintojenlaajuusyksikko_6';

  const koulutusnimi = koulutus.nimi;
  const { change } = useBoundFormActions();
  const currNimi = useFieldValue(`${name}.nimi`);

  useEffect(() => {
    if (_fp.isUndefined(currNimi)) {
      change(`${name}.nimi`, koulutusnimi || {});
    }
  }, [change, currNimi, koulutusnimi, name, t]);

  return (
    <>
      <Box mb={2} {...getTestIdProps('toteutuksenNimi')}>
        <Field
          name={`${name}.nimi.${language}`}
          component={FormFieldInput}
          label={t('toteutuslomake.toteutuksenNimi')}
          required
          disabled={
            koulutus.koulutustyyppi !== KOULUTUSTYYPPI.AIKUISTEN_PERUSOPETUS
          }
        />
      </Box>
      <Box mb={2} display="flex">
        <Box maxWidth="300px">
          <OpintojenLaajuusReadOnlyField
            selectedLanguage={selectedLanguage}
            laajuusKoodiUri={koulutus?.metadata?.opintojenLaajuusKoodiUri}
            laajuusyksikkoKoodiUri={opintojenLaajuusyksikkoKoodiUri}
            laajuusNumero={koulutus?.metadata?.opintojenLaajuusNumero}
            {...getTestIdProps('laajuus')}
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
        {koulutus.koulutustyyppi === KOULUTUSTYYPPI.TUVA && (
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
