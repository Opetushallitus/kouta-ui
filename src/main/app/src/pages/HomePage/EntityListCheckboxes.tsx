import React, { useCallback, useMemo } from 'react';

import _fp from 'lodash/fp';

import { Checkbox } from '#/src/components/virkailija';

import { useEntitySelectionApi } from './useEntitySelection';

export const createHeadingCheckbox =
  selectionActor =>
  ({ rows }) => {
    const { selection, selectItems, deselectItems } =
      useEntitySelectionApi(selectionActor);

    const pageItems = rows;

    const allPageItemsSelected = useMemo(
      () =>
        !_fp.isEmpty(pageItems) &&
        _fp.every(({ oid: pageOid }) => Boolean(selection[pageOid]), pageItems),
      [selection, pageItems]
    );

    const onSelectionChange = useCallback(
      e => {
        if (e.currentTarget.checked) {
          selectItems(pageItems);
        } else {
          deselectItems(pageItems);
        }
      },
      [selectItems, deselectItems, pageItems]
    );

    return (
      <Checkbox onChange={onSelectionChange} checked={allPageItemsSelected} />
    );
  };

export const createRowCheckbox = selectionActor => item => {
  const { selection, selectItems, deselectItems } =
    useEntitySelectionApi(selectionActor);

  const onSelectionChange = useCallback(
    e => {
      if (e.currentTarget.checked) {
        selectItems([item]);
      } else {
        deselectItems([item]);
      }
    },
    [selectItems, deselectItems, item]
  );

  return (
    <Checkbox
      checked={Boolean(selection[item.oid])}
      onChange={onSelectionChange}
    />
  );
};
