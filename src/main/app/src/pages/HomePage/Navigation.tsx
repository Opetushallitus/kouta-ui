import { useState, useCallback, useLayoutEffect, useEffect } from 'react';

import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import Container from '#/src/components/Container';
import { Box, Button, Typography, Icon } from '#/src/components/virkailija';
import { spacing, getThemeProp } from '#/src/theme';
import { OrganisaatioModel } from '#/src/types/domainTypes';
import { getTestIdProps } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

import OrganisaatioDrawer from './OrganisaatioDrawer';

const NavigationContainer = styled.div`
  background-color: white;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
`;

const StickyNavigationWrapper = styled(Box)`
  width: 100%;
  top: 0;
  position: sticky;
  z-index: 2;
`;

const NavigationItem = styled.div<{ active?: boolean }>`
  cursor: pointer;
  margin-right: ${spacing(4)};
  padding-bottom: ${spacing(2)};
  ${getThemeProp('typography.body')};
  border-bottom: 3px solid transparent;

  &:hover {
    color: ${getThemeProp('colors.primary.main')};
  }

  ${({ active }) =>
    active &&
    css`
      color: ${getThemeProp('colors.primary.main')};
      border-color: ${getThemeProp('colors.primary.main')};
    `}
`;

const ANCHOR_IDS = [
  'koulutukset',
  'toteutukset',
  'haut',
  'hakukohteet',
  'valintaperusteet',
];

const scrollToEntitySection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const elementTop = element.getBoundingClientRect().top ?? 0;

    const top = elementTop + document.body.scrollTop - NAVIGATION_OFFSET;

    document.body.scrollTo({
      top,
      behavior: 'smooth',
    });
  }
};

const getNavigationItems = (t: TFunction) =>
  ANCHOR_IDS.map(id => ({
    id,
    label: t(`yleiset.${id}`),
  }));

const NavigationItems = ({ items, activeItem }) => {
  return (
    <Box mr={-2} display="flex">
      {items.map(({ id, label }) => (
        <NavigationItem
          key={id}
          active={id === activeItem}
          onClick={() => scrollToEntitySection(id)}
        >
          {label}
        </NavigationItem>
      ))}
    </Box>
  );
};

const NavigationBase = ({
  onOrganisaatioChange,
  organisaatio,
  activeItem,
}: {
  organisaatio?: OrganisaatioModel | null;
  onOrganisaatioChange: (value: string) => void;
  activeItem?: string;
}) => {
  const { t } = useTranslation();
  const organisaatioOid = organisaatio?.oid;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const onCloseDrawer = useCallback(
    () => setDrawerOpen(false),
    [setDrawerOpen]
  );

  const items = getNavigationItems(t);

  useLayoutEffect(() => {
    document.body.style.overflowY = drawerOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflowY = 'auto';
    };
  }, [drawerOpen]);

  const onOpenDrawer = useCallback(() => setDrawerOpen(true), [setDrawerOpen]);

  return (
    <>
      <OrganisaatioDrawer
        open={drawerOpen}
        onClose={onCloseDrawer}
        organisaatioOid={organisaatioOid}
        onOrganisaatioChange={onOrganisaatioChange}
      />

      <NavigationContainer {...getTestIdProps('navigaatio')}>
        <Container maxWidth="1600px">
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" alignItems="flex-end" as="nav">
              <NavigationItems items={items} activeItem={activeItem} />
            </Box>
            <Box py={2}>
              <Box display="flex" alignItems="center">
                <Box flexGrow={1} pr={2}>
                  <Typography {...getTestIdProps('selectedOrganisaatio')}>
                    {organisaatio
                      ? getFirstLanguageValue(organisaatio?.nimi)
                      : null}
                  </Typography>
                </Box>
                <Box flexGrow={0}>
                  <Button
                    disabled={!organisaatio}
                    onClick={onOpenDrawer}
                    variant="outlined"
                    title={t('etusivu.vaihdaOrganisaatiota')}
                    {...getTestIdProps('toggleOrganisaatioDrawer')}
                  >
                    <Icon type="menu" />
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </NavigationContainer>
    </>
  );
};

const NAVIGATION_OFFSET = 90;

const checkIsElementVisible = (element: HTMLElement | null) => {
  if (!element || !('getBoundingClientRect' in element)) {
    return false;
  }

  const rect = element.getBoundingClientRect();

  const windowHeight = window.innerHeight;
  const topVisible = rect.top >= NAVIGATION_OFFSET && rect.top < windowHeight;
  const fillsHeight =
    rect.top < NAVIGATION_OFFSET &&
    rect.bottom + NAVIGATION_OFFSET > windowHeight;

  return topVisible || fillsHeight;
};

const getActiveAnchor = () =>
  ANCHOR_IDS.find(id => {
    const element = document.getElementById(id);
    return checkIsElementVisible(element);
  });

const Navigation = ({
  organisaatio,
  onOrganisaatioChange,
}: {
  organisaatio?: OrganisaatioModel;
  onOrganisaatioChange: (value: string) => void;
}) => {
  const [activeItem, setActiveItem] = useState<string | undefined>(
    () => 'koulutukset'
  );

  useEffect(() => {
    const onScroll = () => {
      setActiveItem(getActiveAnchor());
    };
    document.body.addEventListener('scroll', onScroll);
    return () => document.body.removeEventListener('scroll', onScroll);
  }, [setActiveItem]);

  useEffect(() => {
    window.addEventListener('resize', () => setActiveItem(getActiveAnchor()));
    return () =>
      window.removeEventListener('resize', () =>
        setActiveItem(getActiveAnchor())
      );
  }, []);

  return (
    <StickyNavigationWrapper boxShadow={1}>
      <NavigationBase
        organisaatio={organisaatio}
        onOrganisaatioChange={onOrganisaatioChange}
        activeItem={activeItem}
      />
    </StickyNavigationWrapper>
  );
};

export default Navigation;
