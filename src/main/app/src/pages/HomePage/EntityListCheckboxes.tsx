import React, { useCallback, useMemo } from 'react';

import _fp from 'lodash/fp';

import { Checkbox } from '#/src/components/virkailija';
import { CRUD_ROLES, ENTITY } from '#/src/constants';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';

import { useEntitySelectionApi } from './useEntitySelection';

export const createHeadingCheckbox =
  (selectionActor, entityType) =>
  ({ rows }) => {
    const { selection, selectItems, deselectItems } =
      useEntitySelectionApi(selectionActor);

    const isOphVirkailija = useIsOphVirkailija();

    console.log(rows);

    const pageItems =
      entityType === ENTITY.HAKUKOHDE
        ? _fp.flow(
            _fp.filter(
              ({ organisaatio }) =>
                isOphVirkailija ||
                useCurrentUserHasRole(
                  ENTITY.HAKUKOHDE,
                  CRUD_ROLES.UPDATE,
                  organisaatio?.oid
                )
            )
          )(rows)
        : rows;

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

export const createRowCheckbox = (selectionActor, entityType) => item => {
  const { selection, selectItems, deselectItems } =
    useEntitySelectionApi(selectionActor);

  const isOphVirkailija = useIsOphVirkailija();

  const hasRightsToUpdate =
    isOphVirkailija ||
    useCurrentUserHasRole(
      ENTITY.HAKUKOHDE,
      CRUD_ROLES.UPDATE,
      item?.organisaatio?.oid
    );

  console.log('item ');
  console.log(item);
  console.log('hasRightsToUpdate ' + hasRightsToUpdate);
  console.log('isOphVirkailija ' + isOphVirkailija);

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
      disabled={entityType === ENTITY.HAKUKOHDE ? !hasRightsToUpdate : false}
    />
  );
};
