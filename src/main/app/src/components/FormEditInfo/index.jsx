import React from 'react';
import styled from 'styled-components';

import Icon from '../Icon';
import { getThemeProp } from '../../theme';
import { formatKoutaDateString } from '../../utils';
import Spacing from '../Spacing';
import Anchor from '../Anchor';

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

const FormEditInfo = ({ editor, date, historyUrl, ...props }) => {
  return (
    <Container {...props}>
      <IconContainer>
        <InfoIcon />
      </IconContainer>
      <InfoContainer>
        <Spacing marginBottom={0.25}>Muokattu viimeksi:</Spacing>
        <Spacing marginBottom={0.25}>
          {date ? formatKoutaDateString(date, 'DD.MM.YYYY HH:mm') : null}{' '}
          {editor ? editor : null}
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
