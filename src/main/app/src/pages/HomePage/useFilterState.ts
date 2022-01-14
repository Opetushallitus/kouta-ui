import { useCallback, useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { ENTITY } from '#/src/constants';
import { getPagination, setPaginationAction } from '#/src/state/pagination';

export const useFilterState = (name: string) => {
  const { nimi, koulutustyyppi, page, orderBy, tila } = useSelector(
    getPagination(name)
  );
  const dispatch = useDispatch();
  const setPagination = useCallback(
    pagination => dispatch(setPaginationAction({ name, ...pagination })),
    [dispatch, name]
  );

  // Muut kuin järjestykseen ja paginointiin liittyvät valinnat vaikuttavat hakutulosten määrään -> page 0
  const setTila = useCallback(
    tila => setPagination({ page: 0, tila }),
    [setPagination]
  );

  const setNimi = useCallback(
    nimi => setPagination({ page: 0, nimi }),
    [setPagination]
  );
  let setKoulutustyyppi;
  if (name !== ENTITY.HAKU) {
    setKoulutustyyppi = koulutustyyppi =>
      setPagination({ page: 0, koulutustyyppi });
  }

  return useMemo(
    () => ({
      nimi,
      setNimi,
      koulutustyyppi,
      setKoulutustyyppi,
      page,
      setPage: page => setPagination({ page }),
      orderBy,
      setOrderBy: orderBy => setPagination({ orderBy }),
      tila,
      setTila,
      filtersProps: {
        nimi,
        koulutustyyppi,
        tila,
        onNimiChange: setNimi,
        onKoulutustyyppiChange: setKoulutustyyppi,
        onTilaChange: setTila,
      },
    }),
    [
      page,
      setPagination,
      nimi,
      koulutustyyppi,
      tila,
      orderBy,
      setTila,
      setKoulutustyyppi,
      setNimi,
    ]
  );
};
