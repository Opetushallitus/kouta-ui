import React from 'react';

import { useTranslation } from 'react-i18next';

import Spacing from '#/src/components/Spacing';
import { Typography } from '#/src/components/virkailija';

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
        <Spacing marginBottom={index < items.length - 1 ? 1 : 0} key={org?.oid}>
          <OrganisaatioItem
            {...org}
            selected={org?.oid === selected}
            onToggleFavourite={onToggleFavourite}
            onSelect={onSelect}
          />
        </Spacing>
      ))}
    </>
  );
};

export default OrganisaatioFavouritesList;
