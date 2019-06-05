import React, { useMemo, useState, useCallback } from 'react';
import get from 'lodash/get';
import styled from 'styled-components';
import { connect } from 'react-redux';

import Drawer from '../../Drawer';
import Typography from '../../Typography';
import { isArray, getTestIdProps } from '../../../utils';
import Flex, { FlexItem } from '../../Flex';
import { spacing, getThemeProp } from '../../../theme';
import Button from '../../Button';
import Icon from '../../Icon';
import {
  toggleFavourite,
  selectOrganisaatioFavourites,
} from '../../../state/organisaatioFavourites';
import OrganisaatioTreeList from './OrganisaatioTreeList';
import OrganisaatioFavouritesList from './OrganisaatioFavouritesList';
import useTranslation from '../../useTranslation';
import useLanguage from '../../useLanguage';
import { useOrganisaatiot } from '../../useOrganisaatio';
import Input, { AddonIcon } from '../../Input';
import useDebounceState from '../../useDebounceState';
import useOrganisaatioHierarkia from './useOrganisaatioHierarkia';
import Spin from '../../Spin';

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
  min-width: 25rem;
`;

const TreeContainer = styled(FlexItem).attrs({ grow: 1 })`
  overflow-y: auto;
  overflow-x: auto;
  max-width: 100vw;
  box-sizing: border-box;
  padding: ${spacing(2)};
  padding-top: 0px;
`;

const FooterContainer = styled(Flex).attrs({ justifyCenter: true })`
  border-top: 1px solid ${getThemeProp('palette.border')};
  padding: ${spacing(2)};
`;

const HeaderContainer = styled(FlexItem).attrs({ grow: 0 })`
  padding: ${spacing(2)};
  border-bottom: 1px solid ${getThemeProp('palette.border')};
`;

const FavouriteListContainer = styled.div`
  border-bottom: 1px solid ${getThemeProp('palette.border')};
  padding: ${spacing(2)};
  max-height: 200px;
  overflow-y: auto;
`;

const FilterContainer = styled(FlexItem).attrs({ grow: 0 })`
  padding: ${spacing(2)};
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

const DrawerContent = ({
  organisaatioOid,
  onOrganisaatioChange,
  onClose,
  organisaatioFavourites,
  onToggleFavourite,
}) => {
  const { t } = useTranslation();
  const language = useLanguage();
  const [openOrganisaatiot, setOpenOrganisaatiot] = useState([]);
  const [nameFilter, setNameFilter, debounceNameFilter] = useDebounceState(
    '',
    500,
  );

  const { hierarkia, isLoading: loadingHierarkia } = useOrganisaatioHierarkia({
    name: debounceNameFilter,
  });

  const items = useMemo(() => {
    return getTreeItems(hierarkia, organisaatioFavourites, openOrganisaatiot);
  }, [hierarkia, organisaatioFavourites, openOrganisaatiot]);

  const { organisaatiot: favourites } = useOrganisaatiot(
    organisaatioFavourites,
  );

  const onNameFilterChange = useCallback(e => setNameFilter(e.target.value), [
    setNameFilter,
  ]);

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

  const onSelect = useCallback(oid => setSelectedOrganisaatio(oid), [
    setSelectedOrganisaatio,
  ]);

  return (
    <Container>
      <HeaderContainer>
        <Flex alignCenter>
          <FlexItem grow={1} paddingRight={2}>
            <Typography variant="h5">
              {t('etusivu.vaihdaOrganisaatiota')}
            </Typography>
          </FlexItem>
          <FlexItem grow={0}>
            <CloseIcon onClick={onClose} />
          </FlexItem>
        </Flex>
      </HeaderContainer>

      {favourites && favourites.length > 0 ? (
        <FlexItem grow={0}>
          <FavouriteListContainer>
            <OrganisaatioFavouritesList
              items={favourites}
              selected={selectedOrganisaatio}
              onSelect={oid => setSelectedOrganisaatio(oid)}
              onToggleFavourite={onToggleFavourite}
              language={language}
            />
          </FavouriteListContainer>
        </FlexItem>
      ) : null}

      <FilterContainer>
        <Input
          placeholder="Hae organisaatioita nimellä"
          value={nameFilter}
          onChange={onNameFilterChange}
          addonAfter={
            loadingHierarkia ? (
              <Spin size="small" />
            ) : (
              <AddonIcon type="search" />
            )
          }
        />
      </FilterContainer>

      <TreeContainer {...getTestIdProps('organisaatioDrawerOrganisaatioList')}>
        {items.length > 0 ? (
          <OrganisaatioTreeList
            items={items}
            selected={selectedOrganisaatio}
            onSelect={onSelect}
            onToggleFavourite={onToggleFavourite}
            onToggleOpen={onToggleOpen}
            language={language}
          />
        ) : (
          <Typography variant="secondary">
            Organisaatioita ei löytynyt. Yritä käyttää pidempää hakusanaa
          </Typography>
        )}
      </TreeContainer>
      <FlexItem grow={0}>
        <FooterContainer>
          <Button onClick={onSubmit} disabled={!selectedOrganisaatio}>
            {t('yleiset.valitse')}
          </Button>
        </FooterContainer>
      </FlexItem>
    </Container>
  );
};

export const OrganisaatioDrawer = props => {
  return (
    <Drawer {...props}>
      <DrawerContent {...props} />
    </Drawer>
  );
};

export default connect(
  state => ({
    organisaatioFavourites: selectOrganisaatioFavourites(state),
  }),
  dispatch => ({
    onToggleFavourite: oid => dispatch(toggleFavourite(oid)),
  }),
)(OrganisaatioDrawer);
