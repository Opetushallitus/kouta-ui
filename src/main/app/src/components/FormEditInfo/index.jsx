import React, { useMemo } from 'react';
import styled from 'styled-components';

import Icon from '../Icon';
import { getThemeProp } from '../../theme';
import { formatKoutaDateString, isObject } from '../../utils';
import Spacing from '../Spacing';
import Anchor from '../Anchor';
import useTranslation from '../useTranslation';
import useHenkilo from '../useHenkilo';

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

const getDisplayName = henkilo => {
  if (!isObject(henkilo)) {
    return null;
  }

  const { etunimet, sukunimi } = henkilo;

  if (!etunimet || !sukunimi) {
    return null;
  }

  return `${etunimet} ${sukunimi}`;
};

const Editor = ({ oid }) => {
  const { henkilo } = useHenkilo(oid);
  const displayName = useMemo(() => getDisplayName(henkilo), [henkilo]);

  return displayName;
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
          {date ? formatKoutaDateString(date, 'DD.MM.YYYY HH:mm') : null}{' '}
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
