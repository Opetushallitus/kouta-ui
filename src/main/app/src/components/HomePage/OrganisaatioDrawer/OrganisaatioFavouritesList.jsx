import React from 'react';

import Typography from '../../Typography';
import Spacing from '../../Spacing';
import OrganisaatioItem from './OrganisaatioItem';


export const OrganisaatioFavouritesList = ({
  items,
  onToggleFavourite,
  onSelect,
  selected,
}) => (
  <>
    <Typography variant="secondary" as="div" marginBottom={1}>
      Suosikit
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
        />
      </Spacing>
    ))}
  </>
);

export default OrganisaatioFavouritesList;
