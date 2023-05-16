import React from 'react';

import { useTranslation } from 'react-i18next';

import { Box, Typography } from '#/src/components/virkailija';

import OrganisaatioItem from './OrganisaatioItem';

export const OrganisaatioFavouritesList = ({
  items,
  onToggleFavourite,
  onSelect,
  selected,
  language = 'fi',
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
          id="organization-favourites"
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
