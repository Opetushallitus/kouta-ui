import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { isEmpty, noop } from 'lodash';
import { useTranslation } from 'react-i18next';

import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import { Box, Radio, Icon, Typography } from '#/src/components/virkailija';
import { getThemeProp } from '#/src/theme';
import { disabledStyle } from '#/src/system';

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

const EditOppilaitosIcon = styled(Icon).attrs({
  role: 'button',
  type: 'edit',
})``;

const Container = styled(Box).attrs({
  display: 'flex',
  justifyContent: 'space-between',
})`
  ${EditOppilaitosIcon} {
    transition: opacity 0.25s;
    opacity: 0;
  }

  &:hover {
    ${EditOppilaitosIcon} {
      opacity: 1;
    }
  }
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
  disabled = false,
  showEditOppilaitos = true,
  isOppilaitos = false,
}) => {
  const { t } = useTranslation();

  const onSelect = useCallback(() => {
    onSelectProp(oid);
  }, [oid, onSelectProp]);

  const onToggleFavourite = useCallback(() => {
    onToggleFavouriteProp(oid);
  }, [oid, onToggleFavouriteProp]);

  const onToggleOpen = useCallback(() => {
    onToggleOpenProp(oid);
  }, [oid, onToggleOpenProp]);

  const oppilaitosLink =
    isOppilaitos && showEditOppilaitos ? (
      <Typography as="div" ml={1}>
        <Link to={`/organisaatio/${oid}/oppilaitos`}>
          <EditOppilaitosIcon color="text.secondary" fontSize="1.3rem" />
        </Link>
      </Typography>
    ) : null;

  return (
    <Container>
      <Box flexGrow={1} display="flex" pr={2}>
        <Box flexGrow={0}>
          <Radio checked={selected} onChange={onSelect} disabled={disabled}>
            {getFirstLanguageValue(nimi, language)}
          </Radio>
        </Box>
        {oppilaitosLink}
      </Box>

      <Box display="flex">
        {collapse && !isEmpty(children) ? (
          <Box flexGrow={0} pr={2}>
            <CollapseIcon
              onClick={onToggleOpen}
              type={open ? 'arrow_drop_up' : 'arrow_drop_down'}
            />
          </Box>
        ) : null}

        <FavouriteIcon
          active={favourite}
          disabled={disabled}
          title={t('etusivu.lisaaSuosikkeihin')}
          onClick={disabled ? noop : onToggleFavourite}
        />
      </Box>
    </Container>
  );
};

export default OrganisaatioItem;
