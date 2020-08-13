import React, { useMemo, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  Drawer,
  Typography,
  Icon,
  Input,
  InputIcon,
  Box,
  Divider,
  Spin,
} from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';
import { spacing, getThemeProp } from '#/src/theme';
import Button from '#/src/components/Button';

import {
  toggleFavourite,
  selectOrganisaatioFavourites,
} from '#/src/state/organisaatioFavourites';

import OrganisaatioTreeList from './OrganisaatioTreeList';
import OrganisaatioFavouritesList from './OrganisaatioFavouritesList';
import useLanguage from '#/src/hooks/useLanguage';
import { useOrganisaatiot } from '#/src/hooks/useOrganisaatio';
import useDebounceState from '#/src/hooks/useDebounceState';
import useOrganisaatioHierarkia from './useOrganisaatioHierarkia';
import useAuthorizedUserRoleBuilder from '#/src/hooks/useAuthorizedUserRoleBuilder';

import {
  createCanReadSomethingRoleBuilder,
  getEditLinkURL,
  isEditable,
} from '../utils';

import { OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

import OpetushallitusOrganisaatioItem from './OpetushallitusOrganisaatioItem';
import { useActions } from '#/src/hooks/useActions';

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
  const recursiveGetTreeItems = organisaatio => ({
    ...organisaatio,
    favourite: favourites.includes(organisaatio.oid),
    key: organisaatio.oid,
    children: organisaatio?.children?.map?.(recursiveGetTreeItems) ?? [],
    open: (open || []).includes(organisaatio.oid),
    isEditable: isEditable(roleBuilder, organisaatio),
    editLinkURL: getEditLinkURL(organisaatio),
  });

  return organisaatiot.map(recursiveGetTreeItems);
};

const getFavouriteItems = (favourites, roleBuilder) =>
  favourites?.map(organisaatio => ({
    ...organisaatio,
    favourite: true,
    isEditable: isEditable(roleBuilder, organisaatio),
    editLinkURL: getEditLinkURL(organisaatio),
  })) ?? [];

const useFavouriteItems = (oids, roleBuilder) => {
  const { organisaatiot: favourites } = useOrganisaatiot(oids);
  return useMemo(() => getFavouriteItems(favourites, roleBuilder), [
    favourites,
    roleBuilder,
  ]);
};

const DrawerContent = ({ organisaatioOid, onOrganisaatioChange, onClose }) => {
  const organisaatioFavourites = useSelector(selectOrganisaatioFavourites);
  const [onToggleFavourite] = useActions([toggleFavourite]);
  const roleBuilder = useAuthorizedUserRoleBuilder();

  const hasOphOption = useMemo(
    () =>
      createCanReadSomethingRoleBuilder(
        roleBuilder,
        OPETUSHALLITUS_ORGANISAATIO_OID
      ).result(),
    [roleBuilder]
  );

  const nameSearchEnabled = hasOphOption;

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

  const { hierarkia, isLoading: loadingHierarkia } = useOrganisaatioHierarkia({
    name: debounceNameFilter,
    nameSearchEnabled,
  });

  const items = useMemo(
    () =>
      getTreeItems(
        hierarkia,
        organisaatioFavourites,
        openOrganisaatiot,
        roleBuilder
      ),
    [hierarkia, organisaatioFavourites, openOrganisaatiot, roleBuilder]
  );

  const favouriteItems = useFavouriteItems(organisaatioFavourites, roleBuilder);
  const hasFavourites = favouriteItems?.length > 0;

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
                <OpetushallitusOrganisaatioItem
                  favourite={ophIsFavourite}
                  selected={
                    selectedOrganisaatio === OPETUSHALLITUS_ORGANISAATIO_OID
                  }
                  onToggleFavourite={onToggleFavourite}
                  onSelect={setSelectedOrganisaatio}
                />
              </Box>
            )}

            {hasFavourites && (
              <FavouriteListContainer mb={1}>
                <OrganisaatioFavouritesList
                  items={favouriteItems}
                  selected={selectedOrganisaatio}
                  onSelect={setSelectedOrganisaatio}
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
            onSelect={setSelectedOrganisaatio}
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

export default OrganisaatioDrawer;
