import React, { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import { useBoundFormActions } from '#/src/hooks/form';
import { getTestIdProps } from '#/src/utils';

import { OpintojenLaajuusReadOnlyField } from './OpintojenLaajuusReadOnlyField';

export const VapaaSivistystyoAmmMuuTiedotSection = ({
  koulutus,
  language,
  name,
}) => {
  const { t } = useTranslation();

  const { change } = useBoundFormActions();
  useEffect(() => {
    change('tiedot.nimi', koulutus?.information?.nimi);
    return () => change('tiedot.nimi', {});
  }, [change, koulutus]);

  const selectedLanguage = useLanguageTab();
  const opintojenLaajuusyksikkoKoodiUri =
    koulutus?.metadata?.opintojenLaajuusyksikkoKoodiUri;

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
      <Box maxWidth="300px">
        <OpintojenLaajuusReadOnlyField
          selectedLanguage={selectedLanguage}
          laajuusKoodiUri={koulutus?.metadata?.opintojenLaajuusKoodiUri}
          laajuusyksikkoKoodiUri={opintojenLaajuusyksikkoKoodiUri}
          laajuusNumero={koulutus?.metadata?.opintojenLaajuusNumero}
        />
      </Box>
    </>
  );
};
