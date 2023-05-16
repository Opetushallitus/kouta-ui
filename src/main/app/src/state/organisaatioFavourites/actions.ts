import { createAction } from '@reduxjs/toolkit';

export const ADD_FAVOURITE = 'organisaatioFavourites/ADD_FAVOURITE';
export const REMOVE_FAVOURITE = 'organisaatioFavourites/REMOVE_FAVOURITE';

export const addFavourite = createAction<string>(ADD_FAVOURITE);
export const removeFavourite = createAction<string>(REMOVE_FAVOURITE);

export const toggleFavourite = (oid: string) => (dispatch, getState) => {
  const { organisaatioFavourites = {} } = getState();
  if (organisaatioFavourites.byOid[oid]) {
    return dispatch(removeFavourite(oid));
  }

  return dispatch(addFavourite(oid));
};
