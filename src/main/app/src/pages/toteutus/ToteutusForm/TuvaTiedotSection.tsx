import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput, FormFieldSwitch } from '#/src/components/formFields';
import { Box, FormControl, Input } from '#/src/components/virkailija';
import useKoodi from '#/src/hooks/useKoodi';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { getTestIdProps } from '#/src/utils';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';

export const TuvaTiedotSection = ({ language, name, koulutus }) => {
  const { t } = useTranslation();

  const { koodi: laajuusKoodi } = useKoodi(
    koulutus.metadata.opintojenLaajuusKoodiUri
  );

  const userLanguage = useUserLanguage();

  return (
    <>
      <Box mb={2} {...getTestIdProps('toteutuksenNimi')}>
        <Field
          name={`${name}.nimi.${language}`}
          component={FormFieldInput}
          label={t('toteutuslomake.toteutuksenNimi')}
          required
        />
      </Box>
      <Box mb={2} display="flex">
        <Box>
          <FormControl label={t('toteutuslomake.laajuus')} disabled={true}>
            <Input
              value={getKoodiNimiTranslation(laajuusKoodi, userLanguage) || ''}
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
          name={`${name}.tuvaErityisopetuksena`}
          component={FormFieldSwitch}
        >
          {t('toteutuslomake.jarjestetaanErityisopetuksena')}
        </Field>
      </Box>
    </>
  );
};
