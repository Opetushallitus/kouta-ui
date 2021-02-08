import { useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { getPagination, setPaginationAction } from '#/src/state/pagination';

export const useFilterState = ({ paginationName } = {}) => {
  const { nimi, page, showArchived, orderBy, tila } = useSelector(
    getPagination(paginationName)
  );
  const dispatch = useDispatch();
  const setPagination = useCallback(
    pagination => {
      return dispatch(
        setPaginationAction({ name: paginationName, ...pagination })
      );
    },
    [dispatch, paginationName]
  );
  const setNimi = nimi => setPagination({ nimi });
  const setPage = page => setPagination({ page });
  const setOrderBy = orderBy => setPagination({ orderBy });
  const setTila = tila => setPagination({ tila });
  const setShowArchived = showArchived => setPagination({ showArchived });

  const onShowArchivedChange = useCallback(
    e => {
      setPagination({ showArchived: e.target.checked });
    },
    [setPagination]
  );
  const onNimiChange = useCallback(
    e => {
      setPagination({ nimi: e.target.value });
    },
    [setPagination]
  );
  return {
    setNimi,
    nimi,
    debouncedNimi: nimi,
    page,
    setPage,
    orderBy,
    setOrderBy,
    showArchived,
    setShowArchived,
    tila,
    setTila,
    filtersProps: {
      nimi,
      showArchived,
      tila,
      onNimiChange,
      onShowArchivedChange,
      onTilaChange: setTila,
    },
  };
};

export default useFilterState;
