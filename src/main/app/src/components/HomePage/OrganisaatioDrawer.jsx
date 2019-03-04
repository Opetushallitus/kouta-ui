import React, { useMemo, useState, useCallback } from 'react';
import get from 'lodash/get';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';

import Drawer from '../Drawer';
import TreeList from '../TreeList';
import Typography from '../Typography';
import { isArray, getFirstLanguageValue } from '../../utils';
import Flex, { FlexItem } from '../Flex';
import { spacing, getThemeProp } from '../../theme';
import Button from '../Button';
import Radio from '../Radio';
import Icon from '../Icon';
import { toggleFavourite } from '../../state/organisaatioFavourites';
import { getOrganisaatiotFromHierarkia } from './utils';
import Spacing from '../Spacing';

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

const FavouriteIconBase = styled(Icon)`
  color: ${getThemeProp('palette.text.primary')};
  cursor: pointer;

  ${({ active }) =>
    active &&
    css`
      color: ${getThemeProp('palette.primary.main')};
    `};
`;

const FavouriteIcon = ({ active = false, ...props }) => (
  <FavouriteIconBase
    active={active}
    type={active ? 'star' : 'star_border'}
    {...props}
  />
);

const getTreeItems = (organisaatiot, favourites) => {
  const recursiveGetTreeItems = organisaatio => {
    const children = isArray(get(organisaatio, 'children'))
      ? organisaatio.children
      : [];

    return {
      ...organisaatio,
      favourite: favourites.includes(organisaatio.oid),
      key: organisaatio.oid,
      children: children.map(c => recursiveGetTreeItems(c)),
    };
  };

  return organisaatiot.map(recursiveGetTreeItems);
};

const OrganisaatioItem = ({
  selected,
  favourite,
  onToggleFavourite: onToggleFavouriteProp,
  onSelect: onSelectProp,
  oid,
  nimi,
}) => {
  const onSelect = useCallback(() => {
    onSelectProp(oid);
  }, [oid, onSelectProp]);

  const onToggleFavourite = useCallback(() => {
    onToggleFavouriteProp(oid);
  }, [oid, onToggleFavouriteProp]);

  return (
    <Typography>
      <Flex>
        <FlexItem grow={1} paddingRight={2}>
          <Radio checked={selected} onChange={onSelect}>
            {getFirstLanguageValue(nimi)}
          </Radio>
        </FlexItem>
        <FlexItem grow={0}>
          <FavouriteIcon
            active={favourite}
            title="Lisää suosikkeihin"
            onClick={onToggleFavourite}
          />
        </FlexItem>
      </Flex>
    </Typography>
  );
};

const OrganisaatioTreeList = ({
  items,
  onSelect,
  selected,
  onToggleFavourite,
}) => (
  <TreeList items={items}>
    {({ nimi, oid, favourite }) => (
      <OrganisaatioItem
        oid={oid}
        favourite={favourite}
        selected={oid === selected}
        onToggleFavourite={onToggleFavourite}
        onSelect={onSelect}
        nimi={nimi}
      />
    )}
  </TreeList>
);

const FavouriteListContainer = styled.div`
  border-bottom: 1px solid ${getThemeProp('palette.border')};
  padding: ${spacing(2)};
  max-height: 200px;
  overflow-y: auto;
`;

export const FavouriteList = ({
  items,
  onToggleFavourite,
  onSelect,
  selected,
}) => (
  <FavouriteListContainer>
    <Typography variant="secondary" as="div" marginBottom={1}>
      Suosikit
    </Typography>
    {items.map(({ oid, nimi }, index) => (
      <Spacing marginBottom={index < items.length - 1 ? 1 : 0} key={oid}>
        <OrganisaatioItem
          oid={oid}
          favourite={true}
          selected={oid === selected}
          onToggleFavourite={onToggleFavourite}
          onSelect={onSelect}
          nimi={nimi}
        />
      </Spacing>
    ))}
  </FavouriteListContainer>
);

export const OrganisaatioDrawer = ({
  organisaatiot,
  organisaatioOid,
  onOrganisaatioChange,
  onClose,
  organisaatioFavourites = [],
  onToggleFavourite = () => {},
  ...props
}) => {
  const items = useMemo(
    () => getTreeItems(organisaatiot, organisaatioFavourites),
    [organisaatiot, organisaatioFavourites],
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
          <FlexItem grow={1}>
            <FavouriteList
              items={favourites}
              selected={selectedOrganisaatio}
              onSelect={oid => setSelectedOrganisaatio(oid)}
              onToggleFavourite={onToggleFavourite}
            />
          </FlexItem>
        ) : null}

        <TreeContainer>
          <OrganisaatioTreeList
            items={items}
            selected={selectedOrganisaatio}
            onSelect={oid => setSelectedOrganisaatio(oid)}
            onToggleFavourite={onToggleFavourite}
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
