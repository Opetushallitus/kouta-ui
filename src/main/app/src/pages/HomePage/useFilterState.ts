import { useCallback, useEffect, useMemo } from 'react';

import { usePrevious } from 'react-use';

import { ENTITY } from '#/src/constants';
import { useSelectedOrganisaatioOid } from '#/src/hooks/useSelectedOrganisaatio';

export const useFilterState = (name: ENTITY, state: any, send: any) => {
  const entityType = name;

  const selectedOrganisaatioOid = useSelectedOrganisaatioOid();

  const previousOrganisaatioOid = usePrevious(selectedOrganisaatioOid);

  useEffect(() => {
    if (
      previousOrganisaatioOid != null &&
      selectedOrganisaatioOid !== previousOrganisaatioOid
    ) {
      send({ type: 'RESET_PAGINATION' });
    }
  }, [previousOrganisaatioOid, selectedOrganisaatioOid, send]);

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
      setNimi,
      setHakuNimi,
      setKoulutustyyppi,
      setPage,
      setOrderBy,
      setTila,
      entityType,
      state,
      filtersProps: {
        onNimiChange: setNimi,
        onHakuNimiChange: setHakuNimi,
        onKoulutustyyppiChange: setKoulutustyyppi,
        onTilaChange: setTila,
        onHakutapaChange: setHakutapa,
        onNakyvyysChange: setNakyvyys,
        onKoulutuksenAlkamiskausiChange: setKoulutuksenAlkamiskausi,
        onKoulutuksenAlkamisvuosiChange: setKoulutuksenAlkamisvuosi,
        onOrgWhitelistChange: setOrgWhitelist,
        entityType,
        state,
      },
    }),
    [
      setPage,
      setOrderBy,
      setTila,
      setKoulutustyyppi,
      setNimi,
      setHakuNimi,
      setHakutapa,
      setNakyvyys,
      setKoulutuksenAlkamiskausi,
      setKoulutuksenAlkamisvuosi,
      setOrgWhitelist,
      entityType,
      state,
    ]
  );
};
