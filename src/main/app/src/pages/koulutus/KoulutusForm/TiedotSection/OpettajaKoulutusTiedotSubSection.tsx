import React from 'react';

import { useTranslation } from 'react-i18next';

import { FixedValueKoodiInput } from '#/src/components/FixedValueKoodiInput';
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
import { isTutkintoonJohtavaKorkeakoulutus } from '#/src/utils/koulutus/isTutkintoonJohtavaKorkeakoulutus';

import EnforcedKoulutusSelect from './EnforcedKoulutusSelect';
import { ReadOnlyKoulutusalaSection } from './TiedotSection';
import { useNimiFromKoulutusKoodi } from '../useNimiFromKoulutusKoodi';

export const OpettajaKoulutusTiedotSubSection = ({
  disabled,
  language,
  name,
  koulutustyyppi,
}) => {
  const { t } = useTranslation();
  const selectedLanguage = useLanguageTab();

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
        <KoulutusField
          disabled={disabled}
          name={`${name}.koulutus`}
          koulutustyyppi={koulutustyyppi}
          language={language}
          valitseKoulutusLabel={t('yleiset.valitseKoulutus')}
          required
        />
      )}
      <Box maxWidth="300px" mb={2}>
        <FixedValueKoodiInput
          koodiUri={OpintojenLaajuusyksikko.OPINTOPISTE}
          selectedLanguage={selectedLanguage}
          prefix="60"
          label={t('koulutuslomake.valitseOpintojenLaajuus')}
        />
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
