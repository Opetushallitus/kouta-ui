import { useCallback, useEffect, useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { usePrevious } from 'react-use';

import { ENTITY } from '#/src/constants';
import { useSelectedOrganisaatioOid } from '#/src/hooks/useSelectedOrganisaatio';
import {
  getPagination,
  setPagination as setPaginationAction,
} from '#/src/state/homepageSlice';

export const useFilterState = (name: ENTITY, state: any, send: any) => {
  const dispatch = useDispatch();

  const {
    nimi,
    hakuNimi,
    koulutustyyppi,
    page,
    orderBy,
    tila,
    julkinen,
    nakyvyys,
    hakutapa,
    koulutuksenAlkamiskausi,
    koulutuksenAlkamisvuosi,
    orgWhitelist,
  } = useSelector(getPagination(name));

  const entityType = name;

  console.log(state);

  const setPagination = useCallback(
    pagination => {
      dispatch(setPaginationAction({ name, ...pagination }));
    },
    [dispatch, name]
  );

  const selectedOrganisaatioOid = useSelectedOrganisaatioOid();

  const previousOrganisaatioOid = usePrevious(selectedOrganisaatioOid);

  useEffect(() => {
    if (
      previousOrganisaatioOid != null &&
      selectedOrganisaatioOid !== previousOrganisaatioOid
    ) {
      setPagination({ page: 0 });
    }
  }, [previousOrganisaatioOid, selectedOrganisaatioOid, setPagination]);

  function getStateActionByName(name: string): string {
    return 'SET_' + name.toUpperCase();
  }

  // Muut kuin järjestykseen ja paginointiin liittyvät valinnat vaikuttavat hakutulosten määrään -> page 0
  const setTila = useCallback(
    tila =>
      send({
        type: getStateActionByName(name),
        [name]: { page: 0, tila: tila },
      }),
    [send, name]
  );

  const setNimi = useCallback(
    nimi =>
      send({
        type: getStateActionByName(name),
        [name]: { page: 0, nimi: nimi },
      }),
    [send, name]
  );

  const setHakuNimi = useCallback(
    hakuNimi =>
      send({
        type: getStateActionByName(name),
        [name]: { page: 0, hakuNimi: hakuNimi },
      }),
    [send, name]
  );

  let setKoulutustyyppi;
  if (name !== ENTITY.HAKU) {
    setKoulutustyyppi = koulutustyyppi =>
      send({
        type: getStateActionByName(name),
        [name]: { page: 0, koulutustyyppi: koulutustyyppi },
      });
  }

  let setOrgWhitelist;
  if (name === ENTITY.HAKUKOHDE) {
    setOrgWhitelist = orgWhitelist =>
      send({
        type: getStateActionByName(name),
        [name]: { page: 0, orgWhitelist: orgWhitelist },
      });
  }

  let setHakutapa;
  let setKoulutuksenAlkamiskausi;
  let setKoulutuksenAlkamisvuosi;
  if (name === ENTITY.HAKU) {
    setHakutapa = hakutapa =>
      send({
        type: getStateActionByName(name),
        [name]: { page: 0, hakutapa: hakutapa },
      });
    setKoulutuksenAlkamiskausi = koulutuksenAlkamiskausi =>
      send({
        type: getStateActionByName(name),
        [name]: { page: 0, koulutuksenAlkamiskausi: koulutuksenAlkamiskausi },
      });
    setKoulutuksenAlkamisvuosi = koulutuksenAlkamisvuosi =>
      send({
        type: getStateActionByName(name),
        [name]: { page: 0, koulutuksenAlkamisvuosi: koulutuksenAlkamisvuosi },
      });
  }

  let setNakyvyys;
  if (name === ENTITY.KOULUTUS || name === ENTITY.VALINTAPERUSTE) {
    setNakyvyys = nakyvyys =>
      send({
        type: getStateActionByName(name),
        [name]: { page: 0, nakyvyys: nakyvyys },
      });
  }

  const setOrderBy = useCallback(
    orderBy =>
      send({
        type: getStateActionByName(name),
        [name]: { orderBy: orderBy },
      }),
    [send, name]
  );

  const setPage = useCallback(
    page =>
      send({
        type: getStateActionByName(name),
        [name]: { page: page },
      }),
    [send, name]
  );

  return useMemo(
    () => ({
      nimi,
      setNimi,
      hakuNimi,
      setHakuNimi,
      koulutustyyppi,
      setKoulutustyyppi,
      page,
      setPage,
      orderBy,
      setOrderBy,
      tila,
      setTila,
      julkinen,
      hakutapa,
      nakyvyys,
      koulutuksenAlkamiskausi,
      koulutuksenAlkamisvuosi,
      orgWhitelist,
      entityType,
      state,
      filtersProps: {
        nimi,
        hakuNimi,
        koulutustyyppi,
        tila,
        onNimiChange: setNimi,
        onHakuNimiChange: setHakuNimi,
        onKoulutustyyppiChange: setKoulutustyyppi,
        onTilaChange: setTila,
        hakutapa,
        onHakutapaChange: setHakutapa,
        nakyvyys,
        onNakyvyysChange: setNakyvyys,
        koulutuksenAlkamiskausi,
        onKoulutuksenAlkamiskausiChange: setKoulutuksenAlkamiskausi,
        koulutuksenAlkamisvuosi,
        onKoulutuksenAlkamisvuosiChange: setKoulutuksenAlkamisvuosi,
        orgWhitelist,
        onOrgWhitelistChange: setOrgWhitelist,
        entityType,
        state,
      },
    }),
    [
      page,
      setPage,
      nimi,
      hakuNimi,
      koulutustyyppi,
      tila,
      orderBy,
      setOrderBy,
      setTila,
      setKoulutustyyppi,
      setNimi,
      setHakuNimi,
      julkinen,
      hakutapa,
      setHakutapa,
      nakyvyys,
      setNakyvyys,
      koulutuksenAlkamiskausi,
      setKoulutuksenAlkamiskausi,
      koulutuksenAlkamisvuosi,
      setKoulutuksenAlkamisvuosi,
      orgWhitelist,
      setOrgWhitelist,
      entityType,
      state,
    ]
  );
};
