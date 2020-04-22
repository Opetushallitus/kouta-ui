import { createAction } from 'redux-actions';

export const SET_PAGE = 'pagination/SET_PAGE';

export const setPageAction = createAction(SET_PAGE);

/*
export const setPage = page => (dispatch, getState) => {
  const { pagination = {} } = getState();

  return dispatch(setPageAction(page));
};
*/
