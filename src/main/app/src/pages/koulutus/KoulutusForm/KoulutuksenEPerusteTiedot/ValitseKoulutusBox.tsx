import React from 'react';

import { useTranslation } from 'react-i18next';

import KoulutusField from '#/src/components/KoulutusField';
import { Box, Spin } from '#/src/components/virkailija';
import { useFieldValue } from '#/src/hooks/form';
import { getTestIdProps } from '#/src/utils';
import { useKoulutusByKoodi } from '#/src/utils/koulutus/getKoulutusByKoodi';
import { getLanguageValue } from '#/src/utils/languageUtils';

import { InfoBoxGrid, StyledInfoBox } from './InfoBox';

export const ValitseKoulutusBox = ({
  fieldName,
  disabled = false,
  language,
}) => {
  const { t } = useTranslation();

  const koulutusFieldValue = useFieldValue(fieldName)?.value;
  const { data: koulutus, isFetching } = useKoulutusByKoodi({
    koodiUri: koulutusFieldValue,
  });

  const nimi = getLanguageValue(koulutus?.nimi, language);
  const koulutusala = getLanguageValue(koulutus?.koulutusala, language);

  return (
    <StyledInfoBox mb={2}>
      <Box width={0.7} mb={2} {...getTestIdProps('koulutusSelect')}>
        <KoulutusField disabled={disabled} name={fieldName} />
      </Box>
      {isFetching ? (
        <Spin />
      ) : (
        koulutus && (
          <InfoBoxGrid
            rows={[
              {
                title: t('yleiset.koulutus'),
                description: `${nimi} (${koulutus?.koodiArvo})`,
              },
              {
                title: t('yleiset.koulutusala'),
                description: koulutusala,
              },
            ]}
          />
        )
      )}
    </StyledInfoBox>
  );
};
