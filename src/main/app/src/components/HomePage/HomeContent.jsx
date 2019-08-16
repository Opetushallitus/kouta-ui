import React, { useState, useCallback, useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import { connect } from 'react-redux';

import Flex, { FlexItem } from '../Flex';
import { getFirstLanguageValue, getTestIdProps, compose } from '../../utils';
import Typography from '../Typography';
import Spacing from '../Spacing';
import KoulutuksetSection from './KoulutuksetSection';
import ToteutuksetSection from './ToteutuksetSection';
import HautSection from './HautSection';
import OrganisaatioDrawer from './OrganisaatioDrawer';
import Button from '../Button';
import Icon from '../Icon';
import ValintaperusteetSection from './ValintaperusteetSection';
import { useOrganisaatio } from '../useOrganisaatio';
import { setOrganisaatio } from '../../state/organisaatioSelection';
import useAuthorizedUserRoleBuilder from '../useAuthorizedUserRoleBuilder';
import Spin from '../Spin';

import {
  KOULUTUS_ROLE,
  TOTEUTUS_ROLE,
  HAKU_ROLE,
  VALINTAPERUSTE_ROLE,
} from '../../constants';

const HomeContent = ({
  organisaatioOid,
  history,
  onOrganisaatioChange: onOrganisaatioChangeProp = () => {},
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const roleBuilder = useAuthorizedUserRoleBuilder();

  const onCloseDrawer = useCallback(() => setDrawerOpen(false), [
    setDrawerOpen,
  ]);

  const onOpenDrawer = useCallback(() => setDrawerOpen(true), [setDrawerOpen]);

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
    hasValintaperusteReadRole && (
      <ValintaperusteetSection
        canCreate={hasValintaperusteWriteRole}
        organisaatioOid={organisaatioOid}
      />
    ),
  ].filter(Boolean);

  return (
    <>
      <OrganisaatioDrawer
        open={drawerOpen}
        onClose={onCloseDrawer}
        organisaatioOid={organisaatioOid}
        onOrganisaatioChange={onOrganisaatioChange}
      />

      <Flex marginBottom={3} justifyEnd>
        <FlexItem>
          <Flex alignCenter>
            <FlexItem grow={1} paddingRight={2}>
              <Typography {...getTestIdProps('selectedOrganisaatio')}>
                {organisaatio
                  ? getFirstLanguageValue(get(organisaatio, 'nimi'))
                  : null}
              </Typography>
            </FlexItem>
            <FlexItem grow={0}>
              <Button
                onClick={onOpenDrawer}
                variant="outlined"
                title="Vaihda organisaatiota"
                {...getTestIdProps('toggleOrganisaatioDrawer')}
              >
                <Icon type="menu" />
              </Button>
            </FlexItem>
          </Flex>
        </FlexItem>
      </Flex>
      {organisaatio ? (
        listSections.map((section, index) => (
          <Spacing
            marginBottom={index < listSections.length - 1 ? 4 : 0}
            key={index}
          >
            {section}
          </Spacing>
        ))
      ) : (
        <Spin center />
      )}
    </>
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
