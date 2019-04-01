import React from 'react';

import Typography from '../../Typography';
import Spacing from '../../Spacing';
import OrganisaatioItem from './OrganisaatioItem';
import useTranslation from '../../useTranslation';

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
      {items.map(({ oid, nimi }, index) => (
        <Spacing marginBottom={index < items.length - 1 ? 1 : 0} key={oid}>
          <OrganisaatioItem
            oid={oid}
            favourite={true}
            selected={oid === selected}
            onToggleFavourite={onToggleFavourite}
            onSelect={onSelect}
            nimi={nimi}
            language={language}
          />
        </Spacing>
      ))}
    </>
  );
}

export default OrganisaatioFavouritesList;
