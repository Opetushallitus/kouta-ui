import React from 'react';
import styled from 'styled-components';

import Icon from '../Icon';
import { getThemeProp } from '../../theme';
import { formatKoutaDateString, isObject } from '../../utils';
import Spacing from '../Spacing';
import Anchor from '../Anchor';
import useTranslation from '../useTranslation';
import useApiAsync from '../useApiAsync';
import { getOppijanumerorekisteriHenkilo } from '../../apiUtils';

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

const getDisplayName = async ({ httpClient, apiUrls, oid }) => {
  const henkilo = await getOppijanumerorekisteriHenkilo({
    httpClient,
    apiUrls,
    oid,
  });

  if (!isObject(henkilo)) {
    return null;
  }

  const { etunimet, sukunimi } = henkilo;

  if (!etunimet || !sukunimi) {
    return null;
  }

  return `${etunimet} ${sukunimi}`;
};

const noopPromise = () => Promise.resolve(null);

const FormEditInfo = ({ editorOid, date, historyUrl, ...props }) => {
  const { t } = useTranslation();

  const { data: displayName } = useApiAsync({
    promiseFn: editorOid ? getDisplayName : noopPromise,
    oid: editorOid,
    watch: editorOid,
  });

  return (
    <Container {...props}>
      <IconContainer>
        <InfoIcon />
      </IconContainer>
      <InfoContainer>
        <Spacing marginBottom={0.25}>{t('yleiset.muokattuViimeksi')}:</Spacing>
        <Spacing marginBottom={0.25}>
          {date ? formatKoutaDateString(date, 'DD.MM.YYYY HH:mm') : null}{' '}
          {displayName ? displayName : null}
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
