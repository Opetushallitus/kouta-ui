import React from 'react';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import Anchor from '#/src/components/Anchor';
import { Icon, Box } from '#/src/components/virkailija';
import { useMuokkaajaName } from '#/src/hooks/useMuokkaajaName';
import { getThemeProp } from '#/src/theme';
import { EntityModelBase } from '#/src/types/domainTypes';
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

type FormEditProps = {
  entity: EntityModelBase;
  historyUrl?: string;
};

const FormEditInfo = ({ entity, historyUrl }: FormEditProps) => {
  const { t } = useTranslation();

  const muokkaajaName = useMuokkaajaName(entity);

  return (
    <Container>
      <IconContainer>
        <InfoIcon />
      </IconContainer>
      <InfoContainer>
        <Box marginBottom={0.25}>{t('yleiset.muokattuViimeksi')}:</Box>
        <Box marginBottom={0.25}>
          {formatDateValue(entity?.modified)} {muokkaajaName}
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
