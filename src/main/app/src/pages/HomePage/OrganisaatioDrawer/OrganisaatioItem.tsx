import React from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { Box, Radio, Icon, Typography } from '#/src/components/virkailija';
import { disabledStyle } from '#/src/system';
import { getThemeProp } from '#/src/theme';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

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

const EditIcon = styled(Icon).attrs({
  role: 'button',
  type: 'edit',
})`
  margin-top: 2px;
  font-size: 18px;
  border-radius: 20px;
  padding: 4px;
  color: ${getThemeProp('colors.text.secondary')};
  &:hover {
    background-color: ${getThemeProp('colors.grayLighten5')};
    color: ${getThemeProp('colors.text.primary')};
  }
`;

const Container = styled(Box).attrs({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})``;

export const OrganisaatioItem = ({
  selected,
  favourite,
  onToggleFavourite: onToggleFavouriteProp,
  onSelect: onSelectProp,
  oid,
  nimi,
  open = false,
  collapse = false,
  onToggleOpen: onToggleOpenProp = oid => {},
  children = [],
  language = 'fi',
  disabled = false,
  isEditable = false,
  editLinkURL,
}) => {
  const { t } = useTranslation();

  const onSelect = () => onSelectProp(oid);
  const onToggleFavourite = () => onToggleFavouriteProp(oid);
  const onToggleOpen = () => onToggleOpenProp(oid);

  return (
    <Container>
      <Box flexGrow={1} display="flex" pr={2}>
        <Box flexGrow={0} mr={1}>
          <Radio checked={selected} onChange={onSelect} disabled={disabled}>
            {getFirstLanguageValue(nimi, language)}
          </Radio>
        </Box>
        {collapse && !_.isEmpty(children) ? (
          <Box flexGrow={0} pr={2}>
            <CollapseIcon
              onClick={onToggleOpen}
              type={open ? 'arrow_drop_up' : 'arrow_drop_down'}
            />
          </Box>
        ) : null}
      </Box>

      <Box display="flex" alignItems="center">
        <FavouriteIcon
          class="favourite-icon__organization"
          active={favourite}
          disabled={disabled}
          title={t('etusivu.lisaaSuosikkeihin')}
          onClick={disabled ? _.noop : onToggleFavourite}
        />
        {isEditable && editLinkURL ? (
          <Typography as="div" ml={2}>
            <Link to={editLinkURL}>
              <EditIcon />
            </Link>
          </Typography>
        ) : null}
      </Box>
    </Container>
  );
};

export default OrganisaatioItem;
