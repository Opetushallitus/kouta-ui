import { useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { getPagination, setPaginationAction } from '#/src/state/pagination';

export const useFilterState = (name: string) => {
  const { nimi, page, showArchived, orderBy, tila } = useSelector(
    getPagination(name)
  );
  const dispatch = useDispatch();
  const setPagination = useCallback(
    pagination => dispatch(setPaginationAction({ name, ...pagination })),
    [dispatch, name]
  );

  // Muut kuin järjestykseen ja paginointiin liittyvät valinnat vaikuttavat hakutulosten määrään -> page 0
  const setTila = tila => setPagination({ page: 0, tila });

  return {
    setNimi: nimi => setPagination({ page: 0, nimi }),
    nimi,
    page,
    setPage: page => setPagination({ page }),
    orderBy,
    setOrderBy: orderBy => setPagination({ orderBy }),
    showArchived,
    tila,
    setTila,
    filtersProps: {
      nimi,
      showArchived,
      tila,
      onNimiChange: useCallback(
        value => {
          setPagination({ page: 0, nimi: value });
        },
        [setPagination]
      ),
      onTilaChange: setTila,
    },
  };
};
