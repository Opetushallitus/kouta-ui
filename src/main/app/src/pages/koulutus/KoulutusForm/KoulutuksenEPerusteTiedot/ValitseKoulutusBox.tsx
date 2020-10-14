import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Spin } from '#/src/components/virkailija';
import { getLanguageValue } from '#/src/utils/languageUtils';
import { getTestIdProps } from '#/src/utils';
import { useFieldValue } from '#/src/hooks/form';
import KoulutusField from '../KoulutusField';
import { InfoBoxGrid, StyledInfoBox } from './InfoBox';
import { useKoulutusByKoodi } from '#/src/utils/koulutus/getKoulutusByKoodi';

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
        <KoulutusField
          disabled={disabled}
          name={fieldName}
          language={language}
        />
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
