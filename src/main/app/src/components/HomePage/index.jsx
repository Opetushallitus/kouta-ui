import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import queryString from 'query-string';
import { get } from 'lodash';
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
  HAKUKOHDE_ROLE,
} from '../../constants';

import { useTranslation } from 'react-i18next';
import getUserRoles from '../../utils/getUserRoles';
import getRoleOrganisaatioOid from '../../utils/getRoleOrganisaatioOid';
import Title from '../Title';

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
      [
        KOULUTUS_ROLE,
        TOTEUTUS_ROLE,
        HAKU_ROLE,
        VALINTAPERUSTE_ROLE,
        HAKUKOHDE_ROLE,
      ]
        .map(
          roleName =>
            role.startsWith(OPH_PAAKAYTTAJA_ROLE) ||
            role.startsWith(`${roleName}_CRUD`) ||
            role.startsWith(`${roleName}_READ`)
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
    [user]
  );

  if (!firstOrganisaatioOid) {
    return (
      <Alert variant="danger" title={t('etusivu.eiOikeuksiaVirheilmoitus')}>
        {t('etusivu.eiOikeuksiaVirheilmoitusKuvaus')}
      </Alert>
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

const HomePage = ({ kayttajaOid = null, location }) => {
  const { search } = location;
  const { t } = useTranslation();
  const persistedOrganisaatioOid = useSelector(state =>
    selectOrganisaatio(state)
  );

  const query = useMemo(() => queryString.parse(search), [search]);
  const organisaatioOid = get(query, 'organisaatioOid') || null;

  return (
    <>
      <Title>{t('sivuTitlet.etusivu')}</Title>
      <HomeContainer>
        <HomeRoute
          kayttajOid={kayttajaOid}
          organisaatioOid={organisaatioOid}
          persistedOrganisaatioOid={persistedOrganisaatioOid}
        />
      </HomeContainer>
    </>
  );
};

export default HomePage;
