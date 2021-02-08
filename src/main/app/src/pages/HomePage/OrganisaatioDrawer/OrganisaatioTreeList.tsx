import React from 'react';

import { TreeList } from '#/src/components/virkailija';

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
    {itemProps => (
      <OrganisaatioItem
        selected={itemProps.oid === selected}
        onToggleFavourite={onToggleFavourite}
        onSelect={onSelect}
        onToggleOpen={onToggleOpen}
        language={language}
        collapse
        {...itemProps}
      />
    )}
  </TreeList>
);

export default React.memo(OrganisaatioTreeList);
