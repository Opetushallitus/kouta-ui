import React, { useMemo, useState, useCallback, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useUnmount, usePrevious } from 'react-use';
import styled from 'styled-components';

import Button from '#/src/components/Button';
import DividerHeading from '#/src/components/DividerHeading';
import Heading from '#/src/components/Heading';
import {
  Drawer,
  Typography,
  Icon,
  Input,
  InputIcon,
  Box,
  Spin,
} from '#/src/components/virkailija';
import { OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';
import { useActions } from '#/src/hooks/useActions';
import useAuthorizedUserRoleBuilder from '#/src/hooks/useAuthorizedUserRoleBuilder';
import useDebounceState from '#/src/hooks/useDebounceState';
import { useOrganisaatiot } from '#/src/hooks/useOrganisaatio';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import {
  toggleFavourite,
  selectOrganisaatioFavourites,
} from '#/src/state/organisaatioFavourites';
import { spacing, getThemeProp } from '#/src/theme';
import { getTestIdProps } from '#/src/utils';

import {
  createCanReadSomethingRoleBuilder,
  getEditLinkURL,
  isEditable,
} from '../utils';
import OrganisaatioTreeList from './OrganisaatioTreeList';
import { PikavalinnatCollapse } from './PikavalinnatCollapse';
import { SelectedOrganisaatioBox } from './SelectedOrganisaatioBox';
import { useReadableOrganisaatioHierarkia } from './useReadableOrganisaatioHierarkia';

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
  height: 100%;
  min-width: 500px;
  max-width: 600px;
`;

const TreeContainer = styled(Box).attrs({ flexGrow: 1 })`
  box-sizing: border-box;
  flex: 1 1 auto;
`;

const FooterContainer = styled(Box).attrs({
  justifyContent: 'center',
  display: 'flex',
})`
  border-top: 1px solid ${getThemeProp('palette.border')};
`;

const HeaderContainer = styled(Box).attrs({
  display: 'flex',
  alignItems: 'center',
})`
  padding: ${spacing(2)};
  border-bottom: 1px solid ${getThemeProp('palette.border')};
`;

const Content = styled(Box)`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  overflow: auto;
  padding: 15px;
  width: 100%;
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

const DrawerContent = ({
  organisaatioOid,
  onOrganisaatioChange,
  onClose,
  open,
}) => {
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

  const { t } = useTranslation();
  const language = useUserLanguage();
  const [openOrganisaatiot, setOpenOrganisaatiot] = useState([]);
  const [nameFilter, setNameFilter, debounceNameFilter] = useDebounceState(
    '',
    500
  );

  const {
    hierarkia,
    isLoading: loadingHierarkia,
  } = useReadableOrganisaatioHierarkia({
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

  const previousOpen = usePrevious(open);

  const saveOrganisaatioIfChanged = useCallback(() => {
    if (organisaatioOid !== selectedOrganisaatio) {
      onOrganisaatioChange(selectedOrganisaatio);
    }
  }, [onOrganisaatioChange, organisaatioOid, selectedOrganisaatio]);

  useEffect(() => {
    if (open !== previousOpen && !open) {
      saveOrganisaatioIfChanged();
    }
  }, [open, previousOpen, saveOrganisaatioIfChanged]);

  useUnmount(saveOrganisaatioIfChanged);

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
      <Content>
        <SelectedOrganisaatioBox organisaatioOid={selectedOrganisaatio} />
        {(hasFavourites || hasOphOption) && (
          <PikavalinnatCollapse
            {...{
              hasOphOption,
              hasFavourites,
              organisaatioFavourites,
              onToggleFavourite,
              selectedOrganisaatio,
              setSelectedOrganisaatio,
              favouriteItems,
              language,
            }}
          />
        )}
        {nameSearchEnabled ? (
          <Box flexGrow={0} mb={2}>
            <Heading>{t('etusivu.haeOrganisaatioita')}</Heading>
            <Input
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
          </Box>
        ) : (
          <DividerHeading>{t('yleiset.organisaatiot')}</DividerHeading>
        )}

        <TreeContainer {...getTestIdProps('organisaatioList')}>
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
      </Content>

      <Box>
        <FooterContainer p={2}>
          <Button onClick={onClose} disabled={!selectedOrganisaatio}>
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
      <DrawerContent onClose={onClose} open={open} {...props} />
    </Drawer>
  );
};

export default OrganisaatioDrawer;
