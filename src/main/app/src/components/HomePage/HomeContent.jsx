import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';

import Flex, { FlexItem } from '../Flex';
import { getFirstLanguageValue } from '../../utils';
import Typography from '../Typography';
import { getThemeProp, spacing } from '../../theme';
import Spacing from '../Spacing';
import KoulutuksetSection from './KoulutuksetSection';
import ToteutuksetSection from './ToteutuksetSection';
import HautSection from './HautSection';
import OrganisaatioDrawer from './OrganisaatioDrawer';
import Button from '../Button';
import { getOrganisaatioFromHierarkia } from './utils';
import Icon from '../Icon';
import ValintaperusteetSection from './ValintaperusteetSection';

const Container = styled.div`
  max-width: ${getThemeProp('contentMaxWidth')}
  margin: 0px auto;
  padding: ${spacing(3)};
`;

const HomeContent = ({ organisaatiot, organisaatioOid, history }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const onCloseDrawer = useCallback(() => setDrawerOpen(false), [
    setDrawerOpen,
  ]);

  const onOpenDrawer = useCallback(() => setDrawerOpen(true), [setDrawerOpen]);

  const organisaatio = getOrganisaatioFromHierarkia(
    organisaatiot,
    organisaatioOid,
  );

  const onOrganisaatioChange = useCallback(
    value => history.push(`/?organisaatioOid=${value}`),
    [history],
  );

  return (
    <>
      <OrganisaatioDrawer
        open={drawerOpen}
        onClose={onCloseDrawer}
        organisaatioOid={organisaatioOid}
        organisaatiot={organisaatiot}
        onOrganisaatioChange={onOrganisaatioChange}
      />
      <Container>
        <Flex marginBottom={3} justifyEnd>
          <FlexItem>
            <Flex alignCenter>
              <FlexItem grow={1} paddingRight={2}>
                <Typography>
                  {getFirstLanguageValue(get(organisaatio, 'nimi'))}
                </Typography>
              </FlexItem>
              <FlexItem grow={0}>
                <Button
                  onClick={onOpenDrawer}
                  variant="outlined"
                  title="Vaihda organisaatiota"
                >
                  <Icon type="menu" />
                </Button>
              </FlexItem>
            </Flex>
          </FlexItem>
        </Flex>
        <Typography variant="h3" marginBottom={3}>
          Koulutukset ja haut
        </Typography>
        <Spacing marginBottom={3}>
          <KoulutuksetSection organisaatioOid={organisaatioOid} />
        </Spacing>
        <Spacing marginBottom={2}>
          <ToteutuksetSection organisaatioOid={organisaatioOid} />
        </Spacing>
        <Spacing marginBottom={2}>
          <HautSection organisaatioOid={organisaatioOid} />
        </Spacing>
        <Spacing>
          <ValintaperusteetSection organisaatioOid={organisaatioOid} />
        </Spacing>
      </Container>
    </>
  );
};

export default withRouter(HomeContent);
