import React, { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput } from '#/src/components/formFields';
import { Box, FormControl, Input } from '#/src/components/virkailija';
import { useBoundFormActions } from '#/src/hooks/form';
import useKoodi from '#/src/hooks/useKoodi';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { getTestIdProps } from '#/src/utils';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';

export const VapaaSivistystyoAmmMuuTiedotSection = ({
  koulutus,
  language,
  name,
}) => {
  const { t } = useTranslation();

  const { koodi: laajuusKoodi } = useKoodi(
    koulutus?.metadata?.opintojenLaajuusKoodiUri
  );

  const { change } = useBoundFormActions();
  useEffect(() => {
    change('tiedot.nimi', koulutus?.information?.nimi);
    return () => change('tiedot.nimi', {});
  }, [change, koulutus]);

  const userLanguage = useUserLanguage();

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
        <FormControl label={t('toteutuslomake.laajuus')} disabled={true}>
          <Input
            value={getKoodiNimiTranslation(laajuusKoodi, userLanguage) || ''}
            {...getTestIdProps('laajuus')}
          />
        </FormControl>
      </Box>
    </>
  );
};
