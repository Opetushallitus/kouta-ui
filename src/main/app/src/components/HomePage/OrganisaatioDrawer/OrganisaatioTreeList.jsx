import React from 'react';

import TreeList from '../../TreeList';
import OrganisaatioItem from './OrganisaatioItem';

export const OrganisaatioTreeList = ({
  items,
  onSelect,
  selected,
  onToggleFavourite,
  onToggleOpen,
  language = 'fi',
}) => (
  <TreeList items={items} defaultOpen={false}>
    {({ nimi, oid, favourite, children, open, disabled }) => (
      <OrganisaatioItem
        oid={oid}
        favourite={favourite}
        selected={oid === selected}
        onToggleFavourite={onToggleFavourite}
        onSelect={onSelect}
        nimi={nimi}
        onToggleOpen={onToggleOpen}
        children={children}
        open={open}
        language={language}
        disabled={disabled}
        collapse
      />
    )}
  </TreeList>
);

export default React.memo(OrganisaatioTreeList);
