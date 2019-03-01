import { createAction } from 'redux-actions';

export const ADD_FAVOURITE = 'organisaatioFavourites/ADD_FAVOURITE';
export const REMOVE_FAVOURITE = 'organisaatioFavourites/REMOVE_FAVOURITE';

export const addFavourite = createAction(ADD_FAVOURITE);
export const removeFavourite = createAction(REMOVE_FAVOURITE);

export const toggleFavourite = oid => (dispatch, getState) => {
  const { organisaatioFavourites = {} } = getState();

  if (organisaatioFavourites[oid]) {
    return dispatch(removeFavourite(oid));
  }

  return dispatch(addFavourite(oid));
};
