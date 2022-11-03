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
      // console.log("set pagination")
      // console.log(name)
      // console.log(pagination)
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
    tila => {
      send({
        type: getStateActionByName(name),
        [name]: { page: 0, tila: tila },
      });

      return setPagination({ page: 0, tila });
    },
    [send, setPagination, name]
  );

  const setNimi = useCallback(
    nimi => {
      send({
        type: getStateActionByName(name),
        [name]: { page: 0, nimi: nimi },
      });
      return setPagination({ page: 0, nimi });
    },
    [send, setPagination, name]
  );

  const setHakuNimi = useCallback(
    hakuNimi => {
      send({
        type: getStateActionByName(name),
        [name]: { page: 0, hakuNimi: hakuNimi },
      });
      return setPagination({ page: 0, hakuNimi });
    },
    [send, setPagination, name]
  );

  let setKoulutustyyppi;
  if (name !== ENTITY.HAKU) {
    setKoulutustyyppi = koulutustyyppi => {
      send({
        type: getStateActionByName(name),
        [name]: { page: 0, koulutustyyppi: koulutustyyppi },
      });
      return setPagination({ page: 0, koulutustyyppi });
    };
  }

  let setOrgWhitelist;
  if (name === ENTITY.HAKUKOHDE) {
    setOrgWhitelist = orgWhitelist => {
      setPagination({ page: 0, orgWhitelist });
    };
  }

  let setHakutapa;
  let setKoulutuksenAlkamiskausi;
  let setKoulutuksenAlkamisvuosi;
  if (name === ENTITY.HAKU) {
    setHakutapa = hakutapa => setPagination({ page: 0, hakutapa });
    setKoulutuksenAlkamiskausi = koulutuksenAlkamiskausi =>
      setPagination({ page: 0, koulutuksenAlkamiskausi });
    setKoulutuksenAlkamisvuosi = koulutuksenAlkamisvuosi =>
      setPagination({ page: 0, koulutuksenAlkamisvuosi });
  }

  let setNakyvyys;
  if (name === ENTITY.KOULUTUS || name === ENTITY.VALINTAPERUSTE) {
    setNakyvyys = nakyvyys => setPagination({ page: 0, nakyvyys });
  }

  return useMemo(
    () => ({
      nimi,
      setNimi,
      hakuNimi,
      setHakuNimi,
      koulutustyyppi,
      setKoulutustyyppi,
      page,
      setPage: page => setPagination({ page }),
      orderBy,
      setOrderBy: orderBy => setPagination({ orderBy }),
      tila,
      setTila,
      julkinen,
      hakutapa,
      nakyvyys,
      koulutuksenAlkamiskausi,
      koulutuksenAlkamisvuosi,
      orgWhitelist,
      entityType,
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
      setPagination,
      nimi,
      hakuNimi,
      koulutustyyppi,
      tila,
      orderBy,
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
