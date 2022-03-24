import React from 'react';

import { useTranslation } from 'react-i18next';

import KoulutusalaSelect from '#/src/components/KoulutusalaSelect';
import KoulutusField from '#/src/components/KoulutusField';
import { Box, FormControl, Input } from '#/src/components/virkailija';
import { KOULUTUSALA_KASVATUSALAT_KOODIURI } from '#/src/constants';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import useKoodi from '#/src/hooks/useKoodi';
import { getTestIdProps } from '#/src/utils';
import { getOpintojenLaajuusTranslation } from '#/src/utils/getOpintojenLaajuusTranslation';

export const AmmOpettajaKoulutusTiedotSubSection = ({
  disabled,
  language,
  name,
  koulutustyyppi,
}) => {
  const { t } = useTranslation();
  const selectedLanguage = useLanguageTab();

  const { koodi: laajuusKoodi } = useKoodi('opintojenlaajuus_60');
  const { koodi: laajuusyksikko } = useKoodi('opintojenlaajuusyksikko_2');
  const laajuusKoodiMetadata = laajuusKoodi?.metadata;
  const laajuusyksikkoMetadata = laajuusyksikko?.metadata;

  return (
    <>
      <Box mb={2} {...getTestIdProps('koulutusSelect')}>
        <KoulutusField
          disabled={disabled}
          name={`${name}.koulutus`}
          koulutustyyppi={koulutustyyppi}
          language={language}
          valitseKoulutusLabel={t('yleiset.valitseKoulutus')}
          required
        />
      </Box>
      <Box maxWidth="300px" mb={2}>
        <FormControl
          label={t('koulutuslomake.valitseOpintojenLaajuus')}
          disabled={true}
        >
          <Input
            value={
              getOpintojenLaajuusTranslation(
                laajuusKoodiMetadata,
                laajuusyksikkoMetadata,
                selectedLanguage
              ) || ''
            }
            {...getTestIdProps('laajuus')}
          />
        </FormControl>
      </Box>
      <Box maxWidth="300px" mb={2}>
        <FormControl
          label={t('koulutuslomake.valitseTutkintonimike')}
          disabled={true}
        >
          <Input
            value={t('koulutuslomake.eiTutkintonimiketta')}
            {...getTestIdProps('laajuus')}
          />
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl
          label={t('koulutuslomake.valitseKoulutusalat')}
          disabled={true}
        >
          <KoulutusalaSelect
            value={{ value: KOULUTUSALA_KASVATUSALAT_KOODIURI }}
          />
        </FormControl>
      </Box>
    </>
  );
};

export default AmmOpettajaKoulutusTiedotSubSection;
