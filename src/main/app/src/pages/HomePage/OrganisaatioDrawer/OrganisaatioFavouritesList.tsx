import React from 'react';

import { useTranslation } from 'react-i18next';

import { Box, Typography } from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';

import OrganisaatioItem from './OrganisaatioItem';

export const OrganisaatioFavouritesList = ({
  items,
  onToggleFavourite,
  onSelect,
  selected,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="secondary" as="div" marginBottom={1}>
        {t('etusivu.suosikit')}
      </Typography>
      {items.map((org, index) => (
        <Box
          marginBottom={index < items.length - 1 ? 1 : 0}
          key={org?.oid}
          {...getTestIdProps('organization-favourites')}
        >
          <OrganisaatioItem
            {...org}
            selected={org?.oid === selected}
            onToggleFavourite={onToggleFavourite}
            onSelect={onSelect}
          />
        </Box>
      ))}
    </>
  );
};

export default OrganisaatioFavouritesList;
