import React from 'react';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import Anchor from '#/src/components/Anchor';
import Spacing from '#/src/components/Spacing';
import { Icon } from '#/src/components/virkailija';
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

const Editor = ({ oid }) => {
  return oid;
};

const FormEditInfo = ({ editorOid, date, historyUrl, ...props }) => {
  const { t } = useTranslation();

  return (
    <Container {...props}>
      <IconContainer>
        <InfoIcon />
      </IconContainer>
      <InfoContainer>
        <Spacing marginBottom={0.25}>{t('yleiset.muokattuViimeksi')}:</Spacing>
        <Spacing marginBottom={0.25}>
          {formatDateValue(date)}{' '}
          {editorOid ? <Editor oid={editorOid} /> : null}
        </Spacing>
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
