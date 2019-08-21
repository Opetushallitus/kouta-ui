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
import {
  KOULUTUS_ROLE,
  TOTEUTUS_ROLE,
  HAKU_ROLE,
  VALINTAPERUSTE_ROLE,
  OPH_PAAKAYTTAJA_ROLE,
} from '../../constants';
import useTranslation from '../useTranslation';
import getUserRoles from '../../utils/getUserRoles';
import getRoleOrganisaatioOid from '../../utils/getRoleOrganisaatioOid';

const HomeContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
`;

const getFirstOrganisaatioOidWithRequiredRole = user => {
  const userRoles = getUserRoles(user);

  if (userRoles.length === 0) {
    return undefined;
  }

  const validRole = userRoles.find(role => {
    return (
      [KOULUTUS_ROLE, TOTEUTUS_ROLE, HAKU_ROLE, VALINTAPERUSTE_ROLE]
        .map(
          roleName =>
            role.startsWith(OPH_PAAKAYTTAJA_ROLE) ||
            role.startsWith(`${roleName}_CRUD`) ||
            role.startsWith(`${roleName}_READ`),
        )
        .some(Boolean) && getRoleOrganisaatioOid(role)
    );
  });

  return validRole ? getRoleOrganisaatioOid(validRole) : undefined;
};

const HomeRoute = ({ organisaatioOid, persistedOrganisaatioOid }) => {
  const { t } = useTranslation();
  const user = useAuthorizedUser();

  const firstOrganisaatioOid = useMemo(
    () => getFirstOrganisaatioOidWithRequiredRole(user),
    [user],
  );

  if (!firstOrganisaatioOid) {
    return (
      <Alert
        variant="danger"
        message={t('etusivu.eiOikeuksiaVirheilmoitus')}
        description={t('etusivu.eiOikeuksiaVirheilmoitusKuvaus')}
      />
    );
  }

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
    <HomeContent kayttajaOid={user.oid} organisaatioOid={organisaatioOid} />
  );
};

const HomePage = ({
  kayttajaOid = null,
  location,
  persistedOrganisaatioOid,
}) => {
  const { search } = location;

  const query = useMemo(() => queryString.parse(search), [search]);
  const organisaatioOid = get(query, 'organisaatioOid') || null;

  return (
    <HomeContainer>
      <HomeRoute
        kayttajOid={kayttajaOid}
        organisaatioOid={organisaatioOid}
        persistedOrganisaatioOid={persistedOrganisaatioOid}
      />
    </HomeContainer>
  );
};

export default connect(state => ({
  persistedOrganisaatioOid: selectOrganisaatio(state),
}))(HomePage);
