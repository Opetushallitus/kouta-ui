import React from 'react';

import { useTranslation } from 'react-i18next';

import KoulutusField from '#/src/components/KoulutusField';
import { QueryResultWrapper } from '#/src/components/QueryResultWrapper';
import { Box } from '#/src/components/virkailija';
import { useFieldValue } from '#/src/hooks/form';
import { getTestIdProps } from '#/src/utils';
import { useKoulutusByKoodi } from '#/src/utils/koulutus/getKoulutusByKoodi';
import { getLanguageValue } from '#/src/utils/languageUtils';

import { InfoBoxGrid, StyledInfoBox } from './InfoBox';

type ValitseKoulutusBoxProps = {
  fieldName: string;
  label?: string;
  disabled?: boolean;
  language: LanguageCode;
};

export const ValitseKoulutusBox = ({
  fieldName,
  label,
  disabled = false,
  language,
}: ValitseKoulutusBoxProps) => {
  const { t } = useTranslation();

  const koulutusFieldValue = useFieldValue(fieldName)?.value;
  const queryResult = useKoulutusByKoodi({
    koodiUri: koulutusFieldValue,
  });
  const { data: koulutus } = queryResult;

  const nimi = getLanguageValue(koulutus?.nimi, language);
  const koulutusala = getLanguageValue(koulutus?.koulutusala, language);

  return (
    <StyledInfoBox mb={2}>
      <Box width={0.7} mb={2} {...getTestIdProps('koulutusSelect')}>
        <KoulutusField
          disabled={disabled}
          valitseKoulutusLabel={label}
          name={fieldName}
        />
      </Box>
      {koulutusFieldValue && (
        <QueryResultWrapper queryResult={queryResult}>
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
        </QueryResultWrapper>
      )}
    </StyledInfoBox>
  );
};
