import { useCallback } from 'react';

import useDebounceState from '../useDebounceState';

import { useDispatch, useSelector } from 'react-redux';
import { getPagination, setPaginationAction } from '#/src/state/pagination';

export const useFilterState = ({ paginationName, initialNimi = '' } = {}) => {
  const [nimi, setNimi, debouncedNimi] = useDebounceState(initialNimi, 500);

  const { page, showArchived, orderBy, tila } = useSelector(
    getPagination(paginationName),
  );
  const dispatch = useDispatch();
  const setPagination = useCallback(
    pagination => {
      return dispatch(
        setPaginationAction({ name: paginationName, ...pagination }),
      );
    },
    [dispatch, paginationName],
  );

  const setPage = page => setPagination({ page });
  const setOrderBy = orderBy => setPagination({ orderBy });
  const setTila = tila => setPagination({ tila });
  const setShowArchived = showArchived => setPagination({ showArchived });

  const onShowArchivedChange = useCallback(
    e => {
      setPagination({ showArchived: e.target.checked });
    },
    [setPagination],
  );
  const onNimiChange = useCallback(
    e => {
      setNimi(e.target.value);
    },
    [setNimi],
  );
  return {
    setNimi,
    nimi,
    debouncedNimi,
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
