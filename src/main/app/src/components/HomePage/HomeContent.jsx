import React, { useCallback, useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { compose } from '../../utils';
import KoulutuksetSection from './KoulutuksetSection';
import ToteutuksetSection from './ToteutuksetSection';
import HautSection from './HautSection';
import ValintaperusteetSection from './ValintaperusteetSection';
import { useOrganisaatio } from '../useOrganisaatio';
import { setOrganisaatio } from '../../state/organisaatioSelection';
import useAuthorizedUserRoleBuilder from '../useAuthorizedUserRoleBuilder';
import Spin from '../Spin';
import Navigation from './Navigation';
import Container from '../Container';
import Box from '../Box';
import NavigationProvider from './NavigationProvider';
import HakukohteetSection from './HakukohteetSection';

import {
  KOULUTUS_ROLE,
  TOTEUTUS_ROLE,
  HAKU_ROLE,
  HAKUKOHDE_ROLE,
  VALINTAPERUSTE_ROLE,
} from '../../constants';

const HomeContent = ({
  organisaatioOid,
  history,
  onOrganisaatioChange: onOrganisaatioChangeProp = () => {},
}) => {
  const roleBuilder = useAuthorizedUserRoleBuilder();

  const { organisaatio } = useOrganisaatio(organisaatioOid);

  const onOrganisaatioChange = useCallback(
    value => {
      history.push(`/?organisaatioOid=${value}`);
      onOrganisaatioChangeProp(value);
    },
    [history, onOrganisaatioChangeProp],
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
      <Container>
        <Box py={4}>
          {organisaatio ? <Box mb={-4}>{listSections}</Box> : <Spin center />}
        </Box>
      </Container>
    </NavigationProvider>
  );
};

export default compose(
  connect(
    null,
    dispatch => ({
      onOrganisaatioChange: oid => dispatch(setOrganisaatio(oid)),
    }),
  ),
  withRouter,
)(HomeContent);
