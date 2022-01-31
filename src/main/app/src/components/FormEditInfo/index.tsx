import React from 'react';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import Anchor from '#/src/components/Anchor';
import { Icon, Box } from '#/src/components/virkailija';
import { useMuokkaajaName } from '#/src/hooks/useMuokkaajaName';
import { getThemeProp } from '#/src/theme';
import { formatDateValue } from '#/src/utils';

const InfoIcon = styled(Icon).attrs({ type: 'info' })`
  color: ${getThemeProp('palette.primary.main')};
`;

const IconContainer = styled.div`
  margin-right: ${getThemeProp('spacing.unit')}px;
  flex: 0;
`;

const InfoContainer = styled.div`
  font-size: 0.8rem;
  font-family: ${getThemeProp('typography.fontFamily')};
  color: ${getThemeProp('palette.text.primary')};
  line-height: ${getThemeProp('typography.lineHeight')};
`;

const Container = styled.div`
  display: flex;
`;

const FormEditInfo = ({ entity, date, historyUrl, ...props }) => {
  const { t } = useTranslation();

  const editorOid = entity?.muokkaaja;
  const muokkaajaName = useMuokkaajaName(entity);

  return (
    <Container {...props}>
      <IconContainer>
        <InfoIcon />
      </IconContainer>
      <InfoContainer>
        <Box marginBottom={0.25}>{t('yleiset.muokattuViimeksi')}:</Box>
        <Box marginBottom={0.25}>
          {formatDateValue(entity?.modified)}{' '}
          {entity?._enrichedData?.muokkaajanNimi
            ? muokkaajaName
            : editorOid
            ? editorOid
            : null}
        </Box>
        <div>
          {historyUrl ? (
            <Anchor href={historyUrl} target="_blank">
              Näytä versiohistoria
            </Anchor>
          ) : null}
        </div>
      </InfoContainer>
    </Container>
  );
};

export default FormEditInfo;
