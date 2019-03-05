import React, { useMemo, useState, useCallback } from 'react';
import get from 'lodash/get';
import styled from 'styled-components';
import { connect } from 'react-redux';

import Drawer from '../../Drawer';
import Typography from '../../Typography';
import { isArray} from '../../../utils';
import Flex, { FlexItem } from '../../Flex';
import { spacing, getThemeProp } from '../../../theme';
import Button from '../../Button';
import Icon from '../../Icon';
import { toggleFavourite } from '../../../state/organisaatioFavourites';
import { getOrganisaatiotFromHierarkia } from '../utils';
import OrganisaatioTreeList from './OrganisaatioTreeList';
import OrganisaatioFavouritesList from './OrganisaatioFavouritesList';

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
  max-width: 100vw;
  box-sizing: border-box;
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

const getTreeItems = (organisaatiot, favourites, open = []) => {
  const recursiveGetTreeItems = organisaatio => {
    const children = isArray(get(organisaatio, 'children'))
      ? organisaatio.children
      : [];

    return {
      ...organisaatio,
      favourite: favourites.includes(organisaatio.oid),
      key: organisaatio.oid,
      children: children.map(c => recursiveGetTreeItems(c)),
      open: open.includes(organisaatio.oid),
    };
  };

  return organisaatiot.map(recursiveGetTreeItems);
};

const FavouriteListContainer = styled.div`
  border-bottom: 1px solid ${getThemeProp('palette.border')};
  padding: ${spacing(2)};
  max-height: 200px;
  overflow-y: auto;
`;

export const OrganisaatioDrawer = ({
  organisaatiot,
  organisaatioOid,
  onOrganisaatioChange,
  onClose,
  organisaatioFavourites = [],
  onToggleFavourite = () => {},
  ...props
}) => {
  const [openOrganisaatiot, setOpenOrganisaatiot] = useState([]);

  const items = useMemo(
    () =>
      getTreeItems(organisaatiot, organisaatioFavourites, openOrganisaatiot),
    [organisaatiot, organisaatioFavourites, openOrganisaatiot],
  );

  const favourites = useMemo(
    () => getOrganisaatiotFromHierarkia(organisaatiot, organisaatioFavourites),
    [organisaatiot, organisaatioFavourites],
  );

  const [selectedOrganisaatio, setSelectedOrganisaatio] = useState(
    organisaatioOid,
  );

  const onSubmit = useCallback(() => {
    onOrganisaatioChange(selectedOrganisaatio);
    onClose();
  }, [onClose, onOrganisaatioChange, selectedOrganisaatio]);

  const onToggleOpen = useCallback(
    oid => {
      if (openOrganisaatiot.includes(oid)) {
        setOpenOrganisaatiot([...openOrganisaatiot.filter(o => o !== oid)]);
      } else {
        setOpenOrganisaatiot([...openOrganisaatiot, oid]);
      }
    },
    [openOrganisaatiot, setOpenOrganisaatiot],
  );

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

        {favourites.length > 0 ? (
          <FlexItem grow={0}>
            <FavouriteListContainer>
              <OrganisaatioFavouritesList
                items={favourites}
                selected={selectedOrganisaatio}
                onSelect={oid => setSelectedOrganisaatio(oid)}
                onToggleFavourite={onToggleFavourite}
              />
            </FavouriteListContainer>
          </FlexItem>
        ) : null}

        <TreeContainer>
          <OrganisaatioTreeList
            items={items}
            selected={selectedOrganisaatio}
            onSelect={oid => setSelectedOrganisaatio(oid)}
            onToggleFavourite={onToggleFavourite}
            onToggleOpen={onToggleOpen}
          />
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

export default connect(
  ({ organisaatioFavourites: favourites }) => ({
    organisaatioFavourites: Object.keys(favourites.byOid),
  }),
  dispatch => ({
    onToggleFavourite: oid => dispatch(toggleFavourite(oid)),
  }),
)(OrganisaatioDrawer);
