import React from 'react';
import memoize from 'memoizee';
import { connect } from 'react-redux';
import queryString from 'query-string';
import get from 'lodash/get';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import ApiAsync from '../ApiAsync';
import { getKayttajanOrganisaatiot } from '../../apiUtils';
import HomeContent from './HomeContent';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.palette.mainBackground};
`;

const memoizedGetKayttajanOrganisaatiot = memoize(
  (apiUrls, httpClient, kayttajaOid) =>
    getKayttajanOrganisaatiot({ oid: kayttajaOid, apiUrls, httpClient }),
  { promise: true },
);

const getKayttajanOrganisaatiotPromiseFn = ({
  httpClient,
  apiUrls,
  kayttajaOid,
}) => memoizedGetKayttajanOrganisaatiot(apiUrls, httpClient, kayttajaOid);

const getFirstOrganisaatioOid = organisaatiot => get(organisaatiot, '[0].oid');

const HomeRoute = ({ kayttajaOid, organisaatioOid }) => {
  return (
    <ApiAsync
      promiseFn={getKayttajanOrganisaatiotPromiseFn}
      kayttajaOid={kayttajaOid}
      watch={kayttajaOid}
    >
      {({ data }) => {
        if (!data) {
          return null;
        }

        const firstOrganisaatioOid = getFirstOrganisaatioOid(data);

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
            organisaatiot={data}
            kayttajaOid={kayttajaOid}
            organisaatioOid={organisaatioOid}
          />
        );
      }}
    </ApiAsync>
  );
};

const HomePage = ({ kayttajaOid = null, location, ...props }) => {
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
