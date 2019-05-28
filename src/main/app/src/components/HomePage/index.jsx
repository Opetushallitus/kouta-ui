import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import get from 'lodash/get';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import HomeContent from './HomeContent';
import Alert from '../Alert';
import { selectOrganisaatio } from '../../state/organisaatioSelection';
import useAuthorizedUser from '../useAuthorizedUser';
import getUserOrganisaatiotWithRoles from '../../utils/getUserOrganisaatiotWithRoles';
import { KOUTA_INDEX_READ_ROLE } from '../../constants';
import useTranslation from '../useTranslation';
import Container from '../Container';
import { spacing, getThemeProp } from '../../theme';

const HomeContainer = styled.div`
  padding-top: ${spacing(3)}
  padding-bottom: ${spacing(3)}
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  background-color: ${getThemeProp('palette.mainBackground')};
`;

const HomeRoute = ({
  kayttajaOid,
  organisaatioOid,
  persistedOrganisaatioOid,
}) => {
  const { t } = useTranslation();
  const user = useAuthorizedUser();
  const organisaatioOids = useMemo(
    () => getUserOrganisaatiotWithRoles(user, [KOUTA_INDEX_READ_ROLE]),
    [user],
  );

  if (organisaatioOids.length === 0) {
    return (
      <Alert
        variant="danger"
        message={t('etusivu.eiOikeuksiaVirheilmoitus')}
        description={t('etusivu.eiOikeuksiaVirheilmoitusKuvaus')}
      />
    );
  }

  const firstOrganisaatioOid = organisaatioOids[0];

  if (!organisaatioOid) {
    return (
      <Redirect
        to={{
          path: '/',
          search: queryString.stringify({
            organisaatioOid: persistedOrganisaatioOid
              ? persistedOrganisaatioOid
              : firstOrganisaatioOid,
          }),
        }}
      />
    );
  }

  return (
    <HomeContent
      organisaatioOids={organisaatioOids}
      kayttajaOid={kayttajaOid}
      organisaatioOid={organisaatioOid}
    />
  );
};

const HomePage = ({
  kayttajaOid = null,
  location,
  persistedOrganisaatioOid,
}) => {
  const { search } = location;

  const query = queryString.parse(search);
  const organisaatioOid = get(query, 'organisaatioOid') || null;

  return (
    <HomeContainer>
      <Container>
        <HomeRoute
          kayttajOid={kayttajaOid}
          organisaatioOid={organisaatioOid}
          persistedOrganisaatioOid={persistedOrganisaatioOid}
        />
      </Container>
    </HomeContainer>
  );
};

export default connect(state => ({
  kayttajaOid: state.me.oid,
  persistedOrganisaatioOid: selectOrganisaatio(state),
}))(HomePage);
