import { useCallback, useEffect, useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { ENTITY } from '#/src/constants';
import { useHasChanged } from '#/src/hooks/useHasChanged';
import { useSelectedOrganisaatio } from '#/src/hooks/useSelectedOrganisaatio';
import { getPagination, setPaginationAction } from '#/src/state/pagination';

export const useFilterState = (name: string) => {
  const dispatch = useDispatch();

  const { nimi, koulutustyyppi, page, orderBy, tila, julkinen } = useSelector(
    getPagination(name)
  );
  const setPagination = useCallback(
    pagination => dispatch(setPaginationAction({ name, ...pagination })),
    [dispatch, name]
  );

  const [selectedOrganisaatio] = useSelectedOrganisaatio();

  const selectedOrganisaatioHasChanged = useHasChanged(selectedOrganisaatio);

  useEffect(() => {
    if (selectedOrganisaatioHasChanged) {
      setPagination({ page: 0 });
    }
  }, [selectedOrganisaatioHasChanged, setPagination]);

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
      julkinen,
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
      julkinen,
    ]
  );
};
