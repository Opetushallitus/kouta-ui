import React, { useMemo, useState, useCallback } from 'react';
import get from 'lodash/get';
import styled from 'styled-components';

import Drawer from '../Drawer';
import TreeList from '../TreeList';
import Typography from '../Typography';
import { isArray, getFirstLanguageValue } from '../../utils';
import Flex, { FlexItem } from '../Flex';
import { spacing, getThemeProp } from '../../theme';
import Button from '../Button';
import Radio from '../Radio';
import Icon from '../Icon';

const CloseIcon = styled(Icon).attrs({ type: 'close' })`
  color: ${getThemeProp('palette.text.primary')};
  opacity: 0.75;
  transition: opacity 0.25s;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

const Container = styled(Flex).attrs({ column: true })`
  height: 100vh;
`;

const TreeContainer = styled(FlexItem).attrs({ grow: 1 })`
  overflow-y: auto;
  overflow-x: auto;
  max-width: 600px;
  padding: ${spacing(2)};
`;

const FooterContainer = styled(Flex).attrs({ justifyCenter: true })`
  border-top: 1px solid ${getThemeProp('palette.border')};
  padding: ${spacing(2)};
`;

const HeaderContainer = styled(FlexItem).attrs({ grow: 0 })`
  padding: ${spacing(2)};
  border-bottom: 1px solid ${getThemeProp('palette.border')};
`;

const getTreeItems = organisaatiot => {
  const recursiveGetTreeItems = organisaatio => {
    const children = isArray(get(organisaatio, 'children'))
      ? organisaatio.children
      : [];

    return {
      ...organisaatio,
      key: organisaatio.oid,
      children: children.map(c => recursiveGetTreeItems(c)),
    };
  };

  return organisaatiot.map(recursiveGetTreeItems);
};

export const OrganisaatioDrawer = ({
  organisaatiot,
  organisaatioOid,
  onOrganisaatioChange,
  onClose,
  ...props
}) => {
  const items = useMemo(() => getTreeItems(organisaatiot), [organisaatiot]);

  const [selectedOrganisaatio, setSelectedOrganisaatio] = useState(
    organisaatioOid,
  );

  const onSubmit = useCallback(() => {
    onOrganisaatioChange(selectedOrganisaatio);
    onClose();
  }, [onClose, onOrganisaatioChange, selectedOrganisaatio]);

  return (
    <Drawer onClose={onClose} {...props}>
      <Container>
        <HeaderContainer>
          <Flex alignCenter>
            <FlexItem grow={1} paddingRight={2}>
              <Typography variant="h5">Vaihda organisaatiota</Typography>
            </FlexItem>
            <FlexItem grow={0}>
              <CloseIcon onClick={onClose} />
            </FlexItem>
          </Flex>
        </HeaderContainer>
        <TreeContainer>
          <TreeList items={items}>
            {({ nimi, oid }) => (
              <Typography>
                <Radio
                  checked={oid === selectedOrganisaatio}
                  onChange={() => setSelectedOrganisaatio(oid)}
                >
                  {getFirstLanguageValue(nimi)}
                </Radio>
              </Typography>
            )}
          </TreeList>
        </TreeContainer>
        <FlexItem grow={0}>
          <FooterContainer>
            <Button onClick={onSubmit} disabled={!selectedOrganisaatio}>
              Valitse
            </Button>
          </FooterContainer>
        </FlexItem>
      </Container>
    </Drawer>
  );
};

export default OrganisaatioDrawer;
