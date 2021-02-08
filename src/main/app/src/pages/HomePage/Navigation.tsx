import React, {
  useState,
  useCallback,
  useContext,
  useMemo,
  useEffect,
  useRef,
  useLayoutEffect,
} from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useEvent } from 'react-use';
import styled, { css } from 'styled-components';

import Button from '#/src/components/Button';
import Container from '#/src/components/Container';
import {
  Box,
  Typography,
  Icon,
  Dropdown,
  DropdownMenu,
  DropdownMenuItem,
} from '#/src/components/virkailija';
import useInView from '#/src/hooks/useInView';
import { spacing, getThemeProp } from '#/src/theme';
import { getTestIdProps } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import scrollElementIntoView from '#/src/utils/scrollElementIntoView';

import { NavigationStateContext } from './NavigationProvider';
import OrganisaatioDrawer from './OrganisaatioDrawer';

const NavigationContainer = styled.div`
  background-color: white;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
`;

const FixedNavigationWrapper = styled(Box)`
  width: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: ${({ theme }) => theme.zIndices.homeNavigation};
`;

const NavigationItem = styled.div`
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

const anchorOrder = ['koulutukset', 'toteutukset', 'haut', 'valintaperusteet'];

const getAnchorLabelById = (id, t) => {
  return {
    koulutukset: t('yleiset.koulutukset'),
    toteutukset: t('yleiset.toteutukset'),
    haut: t('yleiset.haut'),
    hakukohteet: t('yleiset.hakukohteet'),
    valintaperusteet: t('yleiset.valintaperusteet'),
  }[id];
};

const getNavigationItems = (anchors, t) => {
  const items = Object.keys(anchors)
    .filter(([, value]) => !!value)
    .map(id => ({
      id,
      label: getAnchorLabelById(id, t),
    }));

  return items.sort((a, b) => anchorOrder.indexOf(a) - anchorOrder.indexOf(b));
};

const NavigationItems = ({ items, activeItem, maxInlineItems }) => {
  const inlineItems = useMemo(() => items.slice(0, maxInlineItems), [
    items,
    maxInlineItems,
  ]);

  const moreItems = useMemo(() => items.slice(maxInlineItems, items.length), [
    items,
    maxInlineItems,
  ]);

  const moreItemsOverlay = (
    <DropdownMenu>
      {moreItems.map(({ id, label }) => (
        <DropdownMenuItem
          onClick={() => scrollElementIntoView(document.getElementById(id))}
          key={id}
        >
          {label}
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  );

  return (
    <Box mr={-2} display="flex">
      {inlineItems.map(({ id, label }) => (
        <NavigationItem
          key={id}
          active={id === activeItem}
          onClick={() => scrollElementIntoView(document.getElementById(id))}
        >
          {label}
        </NavigationItem>
      ))}
      {moreItems.length > 0 && (
        <NavigationItem>
          <Dropdown overlay={moreItemsOverlay} overflow>
            {({ ref, onToggle }) => (
              <Icon type="more_horiz" ref={ref} onClick={onToggle} />
            )}
          </Dropdown>
        </NavigationItem>
      )}
    </Box>
  );
};

const NavigationBase = ({
  onOrganisaatioChange,
  organisaatio,
  items,
  activeItem,
  maxInlineItems,
}) => {
  const { t } = useTranslation();
  const organisaatioOid = organisaatio?.oid;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const onCloseDrawer = useCallback(() => setDrawerOpen(false), [
    setDrawerOpen,
  ]);

  useLayoutEffect(() => {
    document.documentElement.style.overflowY = drawerOpen ? 'hidden' : 'auto';
    return () => {
      document.documentElement.style.overflowY = 'auto';
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
        <Container>
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" alignItems="flex-end" as="nav">
              <NavigationItems
                items={items}
                activeItem={activeItem}
                maxInlineItems={maxInlineItems}
              />
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

const getElementViewportTop = element => {
  if (!element || !_.isFunction(element.getBoundingClientRect)) {
    return Number.MIN_SAFE_INTEGER;
  }

  return _.get(element.getBoundingClientRect(), 'top');
};

const getActiveAnchor = items => {
  const idAndTop = items.map(({ id }) => {
    return [id, Math.abs(getElementViewportTop(document.getElementById(id)))];
  });

  const min = _.minBy(idAndTop, ([, top]) => top);

  return min ? min[0] : undefined;
};

const Navigation = ({ maxInlineItems = 3, ...props }) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [ref, inView] = useInView();
  const anchors = useContext(NavigationStateContext);
  const { t } = useTranslation();
  const items = useMemo(() => getNavigationItems(anchors, t), [anchors, t]);
  const [activeItem, setActiveItem] = useState();
  const setActiveItemThrottle = useRef();

  useEffect(() => {
    setActiveItem(getActiveAnchor(items));
  }, [items, setActiveItem]);

  useEffect(() => {
    setActiveItemThrottle.current = _.throttle(() => {
      setActiveItem(getActiveAnchor(items));
    }, 500);
  }, [items, setActiveItem]);

  const onScroll = useCallback(() => {
    if (!hasScrolled) {
      setHasScrolled(true);
    }

    _.isFunction(setActiveItemThrottle.current) &&
      setActiveItemThrottle.current();
  }, [hasScrolled]);

  useEvent('scroll', onScroll, window);

  const navigationProps = {
    items,
    activeItem,
    maxInlineItems,
    ...props,
  };

  // TODO: This somehow causes rendering the navigation bar twice during tests. Should be fixed.
  return (
    <>
      <div ref={ref}>
        <NavigationBase {...navigationProps} />
      </div>
      {!inView && hasScrolled && (
        <FixedNavigationWrapper boxShadow={1}>
          <NavigationBase {...navigationProps} />
        </FixedNavigationWrapper>
      )}
    </>
  );
};

export default Navigation;
