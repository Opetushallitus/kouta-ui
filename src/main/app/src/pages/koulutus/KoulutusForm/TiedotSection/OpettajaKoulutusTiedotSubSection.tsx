import React from 'react';

import { useTranslation } from 'react-i18next';

import KoulutusField from '#/src/components/KoulutusField';
import { VerticalBox } from '#/src/components/VerticalBox';
import { Box, FormControl, Input } from '#/src/components/virkailija';
import {
  KoulutusalaKoodi,
  KOULUTUSTYYPPI,
  OpintojenLaajuusyksikko,
  YO_OPETTAJA_KOULUTUS_KOODIURI,
} from '#/src/constants';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import useKoodi from '#/src/hooks/useKoodi';
import { getOpintojenLaajuusTranslation } from '#/src/utils/getOpintojenLaajuusTranslation';
import { isTutkintoonJohtavaKorkeakoulutus } from '#/src/utils/koulutus/isTutkintoonJohtavaKorkeakoulutus';

import { useNimiFromKoulutusKoodi } from '../useNimiFromKoulutusKoodi';
import EnforcedKoulutusSelect from './EnforcedKoulutusSelect';
import { ReadOnlyKoulutusalaSection } from './TiedotSection';

export const OpettajaKoulutusTiedotSubSection = ({
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
    <VerticalBox gap={2}>
      {koulutustyyppi === KOULUTUSTYYPPI.OPETTAJIEN_PEDAGOGISET_OPINNOT && (
        <EnforcedKoulutusSelect
          value={{ value: YO_OPETTAJA_KOULUTUS_KOODIURI }}
        />
      )}
      {koulutustyyppi ===
        KOULUTUSTYYPPI.AMMATILLINEN_OPETTAJA_ERITYISOPETTAJA_JA_OPOKOULUTUS && (
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
      )}
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
        <ReadOnlyKoulutusalaSection koodiUri={KoulutusalaKoodi.KASVATUSALAT} />
      </Box>
    </VerticalBox>
  );
};
