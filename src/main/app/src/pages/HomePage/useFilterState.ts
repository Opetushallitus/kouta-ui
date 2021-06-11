import { useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { getPagination, setPaginationAction } from '#/src/state/pagination';

export const useFilterState = (name: string) => {
  const { nimi, page, showArchived, orderBy, tila } = useSelector(
    getPagination(name)
  );
  const dispatch = useDispatch();
  const setPagination = useCallback(
    pagination => {
      return dispatch(setPaginationAction({ name, ...pagination }));
    },
    [dispatch, name]
  );
  const setPage = page => setPagination({ page });
  const setOrderBy = orderBy => setPagination({ orderBy });

  // Muut kuin järjestykseen ja paginointiin liittyvät valinnat vaikuttavat hakutulosten määrään -> page 0
  const setNimi = nimi => setPagination({ page: 0, nimi });
  const setTila = tila => setPagination({ page: 0, tila });
  const setShowArchived = showArchived =>
    setPagination({ page: 0, showArchived });

  const onShowArchivedChange = useCallback(
    e => {
      setPagination({ page: 0, showArchived: e.target.checked });
    },
    [setPagination]
  );
  const onNimiChange = useCallback(
    value => {
      setPagination({ page: 0, nimi: value });
    },
    [setPagination]
  );
  return {
    setNimi,
    nimi,
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
