import React, {
  useState,
  useCallback,
  useContext,
  useMemo,
  useEffect,
  useRef,
} from 'react';

import get from 'lodash/get';
import styled, { css } from 'styled-components';
import EventListener from 'react-event-listener';
import throttle from 'lodash/throttle';
import minBy from 'lodash/minBy';

import OrganisaatioDrawer from './OrganisaatioDrawer';
import Box from '../Box';
import Typography from '../Typography';
import Button from '../Button';
import { getTestIdProps, getFirstLanguageValue, isFunction } from '../../utils';
import Icon from '../Icon';
import Container from '../Container';
import useInView from '../useInView';
import { NavigationStateContext } from './NavigationProvider';
import useTranslation from '../useTranslation';
import { spacing, getThemeProp } from '../../theme';
import scrollElementIntoView from '../../utils/scrollElementIntoView';

import Dropdown, { DropdownMenu, DropdownMenuItem } from '../Dropdown';

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
  const organisaatioOid = get(organisaatio, 'oid');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const onCloseDrawer = useCallback(() => setDrawerOpen(false), [
    setDrawerOpen,
  ]);

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
                      ? getFirstLanguageValue(get(organisaatio, 'nimi'))
                      : null}
                  </Typography>
                </Box>
                <Box flexGrow={0}>
                  <Button
                    disabled={!organisaatio}
                    onClick={onOpenDrawer}
                    variant="outlined"
                    title="Vaihda organisaatiota"
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
  if (!element || !isFunction(element.getBoundingClientRect)) {
    return Number.MIN_SAFE_INTEGER;
  }

  return get(element.getBoundingClientRect(), 'top');
};

const getActiveAnchor = items => {
  const idAndTop = items.map(({ id }) => {
    return [id, Math.abs(getElementViewportTop(document.getElementById(id)))];
  });

  const min = minBy(idAndTop, ([, top]) => top);

  return min ? min[0] : undefined;
};

const Navigation = ({ maxInlineItems = 3, ...props }) => {
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
    setActiveItemThrottle.current = throttle(() => {
      setActiveItem(getActiveAnchor(items));
    }, 500);
  }, [items, setActiveItem]);

  const onScroll = useCallback(() => {
    setActiveItemThrottle.current();
  }, []);

  const navigationProps = {
    items,
    activeItem,
    maxInlineItems,
    ...props,
  };

  return (
    <>
      <EventListener target="window" onScroll={onScroll} />
      <div ref={ref}>
        <NavigationBase {...navigationProps} />
      </div>
      {!inView && (
        <FixedNavigationWrapper boxShadow={1}>
          <NavigationBase {...navigationProps} />
        </FixedNavigationWrapper>
      )}
    </>
  );
};

export default Navigation;
