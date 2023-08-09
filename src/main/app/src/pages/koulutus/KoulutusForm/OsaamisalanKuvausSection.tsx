import React from 'react';

import { useTranslation } from 'react-i18next';

import StyledSectionHTML from '#/src/components/StyledSectionHTML';
import { Box, Typography } from '#/src/components/virkailija';
import { useFieldValue } from '#/src/hooks/form';
import { useEPerusteOsaamisalaKuvaukset } from '#/src/utils/ePeruste/getOsaamisalakuvauksetByEPerusteId';
import { getLanguageValue } from '#/src/utils/languageUtils';

export const OsaamisalanKuvausSection = ({ language }) => {
  const { t } = useTranslation();
  const selectedEPeruste = useFieldValue('osaamisala.eperuste')?.value;
  const selectedOsaamisala = useFieldValue('osaamisala.osaamisala')?.value;

  const { data: osaamisalaKuvaukset } = useEPerusteOsaamisalaKuvaukset({
    ePerusteId: selectedEPeruste,
  });

  const osaamisalaKuvaus =
    osaamisalaKuvaukset?.[`osaamisala_${selectedOsaamisala}`]?.[0];

  const nimi = getLanguageValue(osaamisalaKuvaus?.nimi, language);
  const kuvaus = getLanguageValue(osaamisalaKuvaus?.teksti, language);

  return (
    <Box>
      <Typography variant="h6">{nimi}</Typography>
      <StyledSectionHTML html={kuvaus} />
      <Typography variant="secondary" as="div" marginTop={1}>
        ({t('yleiset.lahde')}: {t('yleiset.ePerusteet')})
      </Typography>
    </Box>
  );
};

export default OsaamisalanKuvausSection;
