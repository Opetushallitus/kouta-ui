import { useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
  getSelection,
  removeSelection,
  selectItems,
  deselectItems,
} from '#/src/state/homepageSlice';

export const useEntitySelection = entityType => {
  const dispatch = useDispatch();
  const selection = useSelector(getSelection(entityType));

  return {
    selection,
    selectItems: useCallback(
      items => dispatch(selectItems({ name: entityType, items })),
      [entityType, dispatch]
    ),
    deselectItems: useCallback(
      items => dispatch(deselectItems({ name: entityType, items })),
      [entityType, dispatch]
    ),
    removeSelection: useCallback(
      () => dispatch(removeSelection({ name: entityType })),
      [entityType, dispatch]
    ),
  };
};
