import React, { useCallback, useMemo } from 'react';

import { useLocation } from 'react-router';
import { useHistory } from 'react-router-dom';

import Container from '#/src/components/Container';
import { Box, Spin } from '#/src/components/virkailija';
import {
  KOULUTUS_ROLE,
  TOTEUTUS_ROLE,
  HAKU_ROLE,
  HAKUKOHDE_ROLE,
  VALINTAPERUSTE_ROLE,
} from '#/src/constants';
import { useDispatch } from '#/src/hooks/reduxHooks';
import useAuthorizedUserRoleBuilder from '#/src/hooks/useAuthorizedUserRoleBuilder';
import { useOrganisaatio } from '#/src/hooks/useOrganisaatio';
import { setOrganisaatio } from '#/src/state/organisaatioSelection';

import HakukohteetSection from './HakukohteetSection';
import HautSection from './HautSection';
import { KoulutuksetSection } from './KoulutuksetSection';
import Navigation from './Navigation';
import NavigationProvider from './NavigationProvider';
import ToteutuksetSection from './ToteutuksetSection';
import ValintaperusteetSection from './ValintaperusteetSection';

const HomeContent = ({ organisaatioOid }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const roleBuilder = useAuthorizedUserRoleBuilder();

  const { search } = useLocation();
  const { organisaatio } = useOrganisaatio(organisaatioOid);

  const onOrganisaatioChange = useCallback(
    value => {
      const searchParams = new URLSearchParams(search);
      searchParams.set('organisaatioOid', value);
      history.push({ search: searchParams.toString() });
      dispatch(setOrganisaatio(value));
    },
    [history, dispatch, search]
  );

  const hasKoulutusWriteRole = useMemo(() => {
    return roleBuilder.hasCreate(KOULUTUS_ROLE, organisaatio).result();
  }, [roleBuilder, organisaatio]);

  const hasKoulutusReadRole = useMemo(() => {
    return roleBuilder.hasRead(KOULUTUS_ROLE, organisaatio).result();
  }, [roleBuilder, organisaatio]);

  const hasToteutusWriteRole = useMemo(() => {
    return roleBuilder.hasCreate(TOTEUTUS_ROLE, organisaatio).result();
  }, [roleBuilder, organisaatio]);

  const hasToteutusReadRole = useMemo(() => {
    return roleBuilder.hasRead(TOTEUTUS_ROLE, organisaatio).result();
  }, [roleBuilder, organisaatio]);

  const hasHakuWriteRole = useMemo(() => {
    return roleBuilder.hasCreate(HAKU_ROLE, organisaatio).result();
  }, [roleBuilder, organisaatio]);

  const hasHakuReadRole = useMemo(() => {
    return roleBuilder.hasRead(HAKU_ROLE, organisaatio).result();
  }, [roleBuilder, organisaatio]);

  const hasHakukohdeReadRole = useMemo(() => {
    return roleBuilder.hasRead(HAKUKOHDE_ROLE, organisaatio).result();
  }, [roleBuilder, organisaatio]);

  const hasHakukohdeWriteRole = useMemo(() => {
    return roleBuilder.hasCreate(HAKUKOHDE_ROLE, organisaatio).result();
  }, [roleBuilder, organisaatio]);

  const hasValintaperusteWriteRole = useMemo(() => {
    return roleBuilder.hasCreate(VALINTAPERUSTE_ROLE, organisaatio).result();
  }, [roleBuilder, organisaatio]);

  const hasValintaperusteReadRole = useMemo(() => {
    return roleBuilder.hasRead(VALINTAPERUSTE_ROLE, organisaatio).result();
  }, [roleBuilder, organisaatio]);

  const listSections = [
    hasKoulutusReadRole && (
      <KoulutuksetSection
        canCreate={hasKoulutusWriteRole}
        organisaatioOid={organisaatioOid}
      />
    ),
    hasToteutusReadRole && (
      <ToteutuksetSection
        canCreate={hasToteutusWriteRole}
        organisaatioOid={organisaatioOid}
      />
    ),
    hasHakuReadRole && (
      <HautSection
        canCreate={hasHakuWriteRole}
        organisaatioOid={organisaatioOid}
      />
    ),
    hasHakukohdeReadRole && (
      <HakukohteetSection
        canCreate={hasHakukohdeWriteRole}
        organisaatioOid={organisaatioOid}
      />
    ),
    hasValintaperusteReadRole && (
      <ValintaperusteetSection
        canCreate={hasValintaperusteWriteRole}
        organisaatioOid={organisaatioOid}
      />
    ),
  ]
    .filter(Boolean)
    .map((section, index) => (
      <Box mb={4} key={index}>
        {section}
      </Box>
    ));

  return (
    <NavigationProvider>
      <Navigation
        onOrganisaatioChange={onOrganisaatioChange}
        organisaatio={organisaatio}
        maxInlineItems={5}
      />
      <Container maxWidth="1600px">
        <Box py={4}>
          {organisaatio ? <Box mb={-4}>{listSections}</Box> : <Spin center />}
        </Box>
      </Container>
    </NavigationProvider>
  );
};

export default HomeContent;
