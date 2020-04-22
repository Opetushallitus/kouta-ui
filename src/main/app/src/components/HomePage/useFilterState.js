import { useState, useCallback, useMemo } from 'react';

import useDebounceState from '../useDebounceState';

import { useDispatch, useSelector } from 'react-redux';
import { getPage, setPageAction } from '#/src/state/pagination';

export const useFilterState = ({
  paginationName,
  initialNimi = '',
  initialTila = null,
  initialOrderBy = null,
  initialShowArchived = false,
  initialPage = 0,
} = {}) => {
  const [nimi, setNimi, debouncedNimi] = useDebounceState(initialNimi, 500);

  const page = useSelector(getPage(paginationName));
  const dispatch = useDispatch();
  const setPage = useCallback(
    page => {
      return dispatch(setPageAction({ page: page, name: paginationName }));
    },
    [dispatch, paginationName],
  );

  const [showArchived, setShowArchived] = useState(initialShowArchived);
  const [orderBy, setOrderBy] = useState(initialOrderBy);
  const [tila, setTila] = useState(initialTila);

  const onNimiChange = useCallback(
    e => {
      setNimi(e.target.value);
    },
    [setNimi],
  );

  const onShowArchivedChange = useCallback(
    e => {
      setShowArchived(e.target.checked);
    },
    [setShowArchived],
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
