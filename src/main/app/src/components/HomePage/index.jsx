import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import get from 'lodash/get';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { getKayttajanOrganisaatioHierarkia } from '../../apiUtils';
import HomeContent from './HomeContent';
import useApiAsync from '../useApiAsync';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.palette.mainBackground};
`;

const getFirstOrganisaatioOid = organisaatiot => get(organisaatiot, '[0].oid');

const HomeRoute = ({ kayttajaOid, organisaatioOid }) => {
  const { data: organisaatioHierarkia } = useApiAsync({
    promiseFn: getKayttajanOrganisaatioHierarkia,
    oid: kayttajaOid,
    watch: kayttajaOid,
  });

  if (!organisaatioHierarkia) {
    return null;
  }

  const firstOrganisaatioOid = getFirstOrganisaatioOid(organisaatioHierarkia);

  // TODO: display some message
  if (!firstOrganisaatioOid) {
    return null;
  }

  if (!organisaatioOid) {
    return (
      <Redirect
        to={{
          path: '/',
          search: queryString.stringify({
            organisaatioOid: firstOrganisaatioOid,
          }),
        }}
      />
    );
  }

  return (
    <HomeContent
      organisaatiot={organisaatioHierarkia}
      kayttajaOid={kayttajaOid}
      organisaatioOid={organisaatioOid}
    />
  );
};

const HomePage = ({ kayttajaOid = null, location }) => {
  const { search } = location;

  const query = queryString.parse(search);
  const organisaatioOid = get(query, 'organisaatioOid') || null;

  return (
    <Container>
      <HomeRoute kayttajOid={kayttajaOid} organisaatioOid={organisaatioOid} />
    </Container>
  );
};

export default connect(state => ({
  kayttajaOid: state.me.kayttajaOid,
}))(HomePage);
