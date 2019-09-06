import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';

import { getFirstLanguageValue, noop } from '../../../utils';
import isEmpty from '../../../utils/isEmpty';
import Flex, { FlexItem } from '../../Flex';
import { getThemeProp } from '../../../theme';
import Radio from '../../Radio';
import Icon from '../../Icon';
import { disabledStyle } from '../../../system';

const FavouriteIconBase = styled(Icon)`
  color: ${getThemeProp('palette.text.primary')};
  cursor: pointer;

  ${disabledStyle}

  ${({ active }) =>
    active &&
    css`
      color: ${getThemeProp('palette.primary.main')};
    `};
`;

const CollapseIcon = styled(Icon).attrs({ role: 'button' })`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FavouriteIcon = ({ active = false, ...props }) => (
  <FavouriteIconBase
    active={active}
    role="button"
    type={active ? 'star' : 'star_border'}
    {...props}
  />
);

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
  disabled = false,
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
    <Flex>
      <FlexItem grow={1} paddingRight={2}>
        <Radio checked={selected} onChange={onSelect} disabled={disabled}>
          {getFirstLanguageValue(nimi, language)}
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

      <FavouriteIcon
        active={favourite}
        disabled={disabled}
        title="Lisää suosikkeihin"
        onClick={disabled ? noop : onToggleFavourite}
      />
    </Flex>
  );
};

export default OrganisaatioItem;
