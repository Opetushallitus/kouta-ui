import React from 'react';

import { useTranslation } from 'react-i18next';

import KoulutusalaSelect from '#/src/components/KoulutusalaSelect';
import KoulutusField from '#/src/components/KoulutusField';
import { Box, FormControl, Input } from '#/src/components/virkailija';
import { KoulutusalaKoodi, OpintojenLaajuusyksikko } from '#/src/constants';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import useKoodi from '#/src/hooks/useKoodi';
import { getOpintojenLaajuusTranslation } from '#/src/utils/getOpintojenLaajuusTranslation';
import { isTutkintoonJohtavaKorkeakoulutus } from '#/src/utils/koulutus/isTutkintoonJohtavaKorkeakoulutus';

import { useNimiFromKoulutusKoodi } from '../useNimiFromKoulutusKoodi';

export const AmmOpettajaKoulutusTiedotSubSection = ({
  disabled,
  language,
  name,
  koulutustyyppi,
}) => {
  const { t } = useTranslation();
  const selectedLanguage = useLanguageTab();

  const { koodi: laajuusKoodi } = useKoodi('opintojenlaajuus_60');
  const { koodi: laajuusyksikko } = useKoodi(
    OpintojenLaajuusyksikko.OPINTOPISTE
  );
  const laajuusKoodiMetadata = laajuusKoodi?.metadata;
  const laajuusyksikkoMetadata = laajuusyksikko?.metadata;

  useNimiFromKoulutusKoodi({
    nimiFieldName: `${name}.nimi`,
    koulutusFieldName: isTutkintoonJohtavaKorkeakoulutus(koulutustyyppi)
      ? `${name}.korkeakoulutukset`
      : `${name}.koulutus`,
  });

  return (
    <>
      <Box mb={2}>
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
          />
        </FormControl>
      </Box>
      <Box maxWidth="300px" mb={2}>
        <FormControl
          label={t('koulutuslomake.valitseTutkintonimike')}
          disabled={true}
        >
          <Input value={t('koulutuslomake.eiTutkintonimiketta')} />
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl
          label={t('koulutuslomake.valitseKoulutusalat')}
          disabled={true}
        >
          <KoulutusalaSelect value={{ value: KoulutusalaKoodi.KASVATUSALAT }} />
        </FormControl>
      </Box>
    </>
  );
};
