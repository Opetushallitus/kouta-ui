import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import get from 'lodash/get';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { getKayttajanOrganisaatioOids } from '../../apiUtils';
import HomeContent from './HomeContent';
import useApiAsync from '../useApiAsync';
import { isArray } from '../../utils';
import { selectOrganisaatio } from '../../state/organisaatioSelection';
import FullSpin from '../FullSpin';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.palette.mainBackground};
`;

const HomeRoute = ({
  kayttajaOid,
  organisaatioOid,
  persistedOrganisaatioOid,
}) => {
  const { data: organisaatioOids, isLoading } = useApiAsync({
    promiseFn: getKayttajanOrganisaatioOids,
  });

  const persistedOrganisaatioOidIsValid = useMemo(() => {
    return (
      persistedOrganisaatioOid &&
      isArray(organisaatioOids) &&
      organisaatioOids.includes(persistedOrganisaatioOid)
    );
  }, [organisaatioOids, persistedOrganisaatioOid]);

  if (isLoading && !organisaatioOids) {
    return <FullSpin size="large" />;
  }

  // TODO: display an error
  if (!isArray(organisaatioOids) || organisaatioOids.length === 0) {
    return null;
  }

  const firstOrganisaatioOid = organisaatioOids[0];

  if (!organisaatioOid || !organisaatioOids.includes(organisaatioOid)) {
    return (
      <Redirect
        to={{
          path: '/',
          search: queryString.stringify({
            organisaatioOid: persistedOrganisaatioOidIsValid
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
    <Container>
      <HomeRoute
        kayttajOid={kayttajaOid}
        organisaatioOid={organisaatioOid}
        persistedOrganisaatioOid={persistedOrganisaatioOid}
      />
    </Container>
  );
};

export default connect(state => ({
  kayttajaOid: state.me.oid,
  persistedOrganisaatioOid: selectOrganisaatio(state),
}))(HomePage);
