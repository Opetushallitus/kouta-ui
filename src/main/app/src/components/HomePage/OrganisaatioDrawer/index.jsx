import React, { useMemo, useState, useCallback } from 'react';
import { get, isArray } from 'lodash';
import styled from 'styled-components';
import { connect } from 'react-redux';

import Drawer from '../../Drawer';
import Typography from '../../Typography';
import { getTestIdProps } from '../../../utils';
import { spacing, getThemeProp } from '../../../theme';
import Button from '../../Button';
import Icon from '../../Icon';

import {
  toggleFavourite,
  selectOrganisaatioFavourites,
} from '../../../state/organisaatioFavourites';

import OrganisaatioTreeList from './OrganisaatioTreeList';
import OrganisaatioFavouritesList from './OrganisaatioFavouritesList';
import { useTranslation } from 'react-i18next';
import useLanguage from '../../useLanguage';
import { useOrganisaatiot } from '../../useOrganisaatio';
import Input from '../../Input';
import InputIcon from '../../InputIcon';
import useDebounceState from '../../useDebounceState';
import useOrganisaatioHierarkia from './useOrganisaatioHierarkia';
import Spin from '../../Spin';
import useAuthorizedUserRoleBuilder from '../../useAuthorizedUserRoleBuilder';
import { createCanReadSomethingRoleBuilder } from '../utils';

import {
  OPETUSHALLITUS_ORGANISAATIO_OID,
  OPPILAITOS_ROLE,
} from '../../../constants';

import OpetetushallitusOrganisaatioItem from './OpetushallitusOrganisaatioItem';
import Box from '../../Box';
import Divider from '../../Divider';
import organisaatioIsOppilaitos from '../../../utils/organisaatioIsOppilaitos';

const CloseIcon = styled(Icon).attrs({ type: 'close', role: 'button' })`
  color: ${getThemeProp('palette.text.primary')};
  opacity: 0.75;
  transition: opacity 0.25s;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

const Container = styled(Box).attrs({
  display: 'flex',
  flexDirection: 'column',
})`
  height: 100vh;
  min-width: 25rem;
  max-width: 35rem;
`;

const TreeContainer = styled(Box).attrs({ flexGrow: 1 })`
  overflow-y: auto;
  overflow-x: auto;
  max-width: 100vw;
  box-sizing: border-box;
`;

const FooterContainer = styled(Box).attrs({
  justifyContent: 'center',
  display: 'flex',
})`
  border-top: 1px solid ${getThemeProp('palette.border')};
`;

const HeaderContainer = styled(Box).attrs({
  flexGrow: 0,
  display: 'flex',
  alignItems: 'center',
})`
  padding: ${spacing(2)};
  border-bottom: 1px solid ${getThemeProp('palette.border')};
`;

const FavouriteListContainer = styled(Box)`
  max-height: 200px;
  overflow-y: auto;
`;

const FilterContainer = styled(Box).attrs({ flexGrow: 0 })`
  padding: ${spacing(2)};
`;

const getTreeItems = (organisaatiot, favourites, open, roleBuilder) => {
  const recursiveGetTreeItems = organisaatio => {
    const children = isArray(get(organisaatio, 'children'))
      ? organisaatio.children
      : [];

    return {
      ...organisaatio,
      favourite: favourites.includes(organisaatio.oid),
      key: organisaatio.oid,
      children: children.map(c => recursiveGetTreeItems(c)),
      open: (open || []).includes(organisaatio.oid),
      isOppilaitos: organisaatioIsOppilaitos(organisaatio),
      showEditOppilaitos: roleBuilder
        .hasCreate(OPPILAITOS_ROLE, organisaatio)
        .result(),
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
  const roleBuilder = useAuthorizedUserRoleBuilder();

  const hasOphOption = useMemo(
    () =>
      createCanReadSomethingRoleBuilder(
        roleBuilder,
        OPETUSHALLITUS_ORGANISAATIO_OID
      ).result(),
    [roleBuilder]
  );

  const ophIsFavourite = useMemo(
    () => organisaatioFavourites.includes(OPETUSHALLITUS_ORGANISAATIO_OID),
    [organisaatioFavourites]
  );

  const { t } = useTranslation();
  const language = useLanguage();
  const [openOrganisaatiot, setOpenOrganisaatiot] = useState([]);
  const [nameFilter, setNameFilter, debounceNameFilter] = useDebounceState(
    '',
    500
  );

  const nameSearchEnabled = hasOphOption;

  const { hierarkia, isLoading: loadingHierarkia } = useOrganisaatioHierarkia({
    name: debounceNameFilter,
    nameSearchEnabled,
  });

  const items = useMemo(() => {
    return getTreeItems(
      hierarkia,
      organisaatioFavourites,
      openOrganisaatiot,
      roleBuilder
    );
  }, [hierarkia, organisaatioFavourites, openOrganisaatiot, roleBuilder]);

  const { organisaatiot: favourites } = useOrganisaatiot(
    organisaatioFavourites
  );

  const onNameFilterChange = useCallback(e => setNameFilter(e.target.value), [
    setNameFilter,
  ]);

  const [selectedOrganisaatio, setSelectedOrganisaatio] = useState(
    organisaatioOid
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
    [openOrganisaatiot, setOpenOrganisaatiot]
  );

  const onSelect = useCallback(oid => setSelectedOrganisaatio(oid), [
    setSelectedOrganisaatio,
  ]);

  const hasFavourites = favourites && favourites.length > 0;

  return (
    <Container {...getTestIdProps('organisaatioDrawer')}>
      <HeaderContainer>
        <Box flexGrow={1} paddingRight={2}>
          <Typography variant="h5">
            {t('etusivu.vaihdaOrganisaatiota')}
          </Typography>
        </Box>
        <Box flexGrow={0}>
          <CloseIcon onClick={onClose} />
        </Box>
      </HeaderContainer>

      {(hasFavourites || hasOphOption) && (
        <Box flexGrow={0}>
          <Box p={2} mb={-1}>
            {hasOphOption && (
              <Box mb={1}>
                <Typography variant="secondary" as="div" mb={1}>
                  {t('etusivu.rekisterinpitaja')}
                </Typography>
                <OpetetushallitusOrganisaatioItem
                  favourite={ophIsFavourite}
                  selected={
                    selectedOrganisaatio === OPETUSHALLITUS_ORGANISAATIO_OID
                  }
                  onToggleFavourite={onToggleFavourite}
                  onSelect={onSelect}
                />
              </Box>
            )}

            {hasFavourites && (
              <FavouriteListContainer mb={1}>
                <OrganisaatioFavouritesList
                  items={favourites}
                  selected={selectedOrganisaatio}
                  onSelect={oid => setSelectedOrganisaatio(oid)}
                  onToggleFavourite={onToggleFavourite}
                  language={language}
                />
              </FavouriteListContainer>
            )}
          </Box>
          <Divider />
        </Box>
      )}

      {nameSearchEnabled ? (
        <FilterContainer>
          <Input
            placeholder={t('etusivu.haeOrganisaatioita')}
            value={nameFilter}
            onChange={onNameFilterChange}
            suffix={
              loadingHierarkia ? (
                <Spin size="small" />
              ) : (
                <InputIcon type="search" />
              )
            }
          />
        </FilterContainer>
      ) : null}

      <TreeContainer
        {...getTestIdProps('organisaatioList')}
        p={2}
        pt={nameSearchEnabled ? 0 : 2}
      >
        {loadingHierarkia && !nameSearchEnabled ? <Spin center /> : null}

        {items.length > 0 ? (
          <OrganisaatioTreeList
            items={items}
            selected={selectedOrganisaatio}
            onSelect={onSelect}
            onToggleFavourite={onToggleFavourite}
            onToggleOpen={onToggleOpen}
            language={language}
          />
        ) : null}

        {items.length === 0 && !loadingHierarkia ? (
          <Typography variant="secondary">
            {t('etusivu.organisaatioitaEiLoytynyt')}
          </Typography>
        ) : null}
      </TreeContainer>

      <Box flexGrow={0}>
        <FooterContainer p={2}>
          <Button onClick={onSubmit} disabled={!selectedOrganisaatio}>
            {t('yleiset.valitse')}
          </Button>
        </FooterContainer>
      </Box>
    </Container>
  );
};

export const OrganisaatioDrawer = ({ open, onClose, ...props }) => {
  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent onClose={onClose} {...props} />
    </Drawer>
  );
};

export default connect(
  state => ({
    organisaatioFavourites: selectOrganisaatioFavourites(state),
  }),
  dispatch => ({
    onToggleFavourite: oid => dispatch(toggleFavourite(oid)),
  })
)(OrganisaatioDrawer);
