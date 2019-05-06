import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import { connect } from 'react-redux';

import Flex, { FlexItem } from '../Flex';
import { getFirstLanguageValue, getTestIdProps, compose } from '../../utils';
import Typography from '../Typography';
import { getThemeProp, spacing } from '../../theme';
import Spacing from '../Spacing';
import KoulutuksetSection from './KoulutuksetSection';
import ToteutuksetSection from './ToteutuksetSection';
import HautSection from './HautSection';
import OrganisaatioDrawer from './OrganisaatioDrawer';
import Button from '../Button';
import Icon from '../Icon';
import ValintaperusteetSection from './ValintaperusteetSection';
import useTranslation from '../useTranslation';
import { useOrganisaatio } from '../useOrganisaatio';
import { setOrganisaatio } from '../../state/organisaatioSelection';

const Container = styled.div`
  max-width: ${getThemeProp('contentMaxWidth')}
  margin: 0px auto;
  padding: ${spacing(3)};
`;

const HomeContent = ({
  organisaatioOids,
  organisaatioOid,
  history,
  onOrganisaatioChange: onOrganisaatioChangeProp = () => {},
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t } = useTranslation();

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

  return (
    <>
      <OrganisaatioDrawer
        open={drawerOpen}
        onClose={onCloseDrawer}
        organisaatioOid={organisaatioOid}
        organisaatioOids={organisaatioOids}
        onOrganisaatioChange={onOrganisaatioChange}
      />
      <Container>
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
        <Typography variant="h3" marginBottom={3}>
          {t('etusivu.koulutuksetJaHaut')}
        </Typography>
        <Spacing marginBottom={4}>
          <KoulutuksetSection organisaatioOid={organisaatioOid} />
        </Spacing>
        <Spacing marginBottom={4}>
          <ToteutuksetSection organisaatioOid={organisaatioOid} />
        </Spacing>
        <Spacing marginBottom={4}>
          <HautSection organisaatioOid={organisaatioOid} />
        </Spacing>
        <Spacing>
          <ValintaperusteetSection organisaatioOid={organisaatioOid} />
        </Spacing>
      </Container>
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
