import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';
import { ellipsis } from 'polished';

import Typography from '../../Typography';
import { getFirstLanguageValue } from '../../../utils';
import isEmpty from '../../../utils/isEmpty';
import Flex, { FlexItem } from '../../Flex';
import { getThemeProp } from '../../../theme';
import Radio from '../../Radio';
import Icon from '../../Icon';

const FavouriteIconBase = styled(Icon)`
  color: ${getThemeProp('palette.text.primary')};
  cursor: pointer;

  ${({ active }) =>
    active &&
    css`
      color: ${getThemeProp('palette.primary.main')};
    `};
`;

const CollapseIcon = styled(Icon)`
  cursor: pointer;
`;

const FavouriteIcon = ({ active = false, ...props }) => (
  <FavouriteIconBase
    active={active}
    type={active ? 'star' : 'star_border'}
    {...props}
  />
);

const NameContainer = styled.div`
  ${ellipsis('25rem')};
`;

export const OrganisaatioItem = ({
  selected,
  favourite,
  onToggleFavourite: onToggleFavouriteProp,
  onSelect: onSelectProp,
  oid,
  nimi,
  open = false,
  collapse = false,
  onToggleOpen: onToggleOpenProp = () => {},
  children = [],
  language = 'fi',
}) => {
  const onSelect = useCallback(() => {
    onSelectProp(oid);
  }, [oid, onSelectProp]);

  const onToggleFavourite = useCallback(() => {
    onToggleFavouriteProp(oid);
  }, [oid, onToggleFavouriteProp]);

  const onToggleOpen = useCallback(() => {
    onToggleOpenProp(oid);
  }, [oid, onToggleOpenProp]);

  return (
    <Typography>
      <Flex alignCenter>
        <FlexItem grow={1} paddingRight={2}>
          <Radio checked={selected} onChange={onSelect}>
            <Flex>
              <NameContainer>
                {getFirstLanguageValue(nimi, language)}
              </NameContainer>
            </Flex>
          </Radio>
        </FlexItem>
        {collapse && !isEmpty(children) ? (
          <FlexItem grow={0} paddingRight={2}>
            <CollapseIcon
              onClick={onToggleOpen}
              type={open ? 'arrow_drop_up' : 'arrow_drop_down'}
            />
          </FlexItem>
        ) : null}
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

export default OrganisaatioItem;
