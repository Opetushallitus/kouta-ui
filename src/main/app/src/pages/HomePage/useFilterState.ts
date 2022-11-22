import { useCallback, useEffect, useMemo } from 'react';

import { useActor } from '@xstate/react';
import { usePrevious } from 'react-use';

import { ENTITY } from '#/src/constants';
import { useSelectedOrganisaatioOid } from '#/src/hooks/useSelectedOrganisaatio';

export const useFilterState = (name: ENTITY, service) => {
  const entityType = name;

  const [state, send] = useActor(service);

  const selectedOrganisaatioOid = useSelectedOrganisaatioOid();

  const previousOrganisaatioOid = usePrevious(selectedOrganisaatioOid);

  useEffect(() => {
    if (selectedOrganisaatioOid !== previousOrganisaatioOid) {
      send({ type: 'SET_VALUES', values: { page: 0 } });
    }
  }, [previousOrganisaatioOid, selectedOrganisaatioOid, send]);

  // Muut kuin järjestykseen ja paginointiin liittyvät valinnat vaikuttavat hakutulosten määrään -> page 0
  const setTila = useCallback(
    tila =>
      send({
        type: 'SET_VALUES',
        values: { page: 0, tila: tila },
      }),
    [send]
  );

  const setNimi = useCallback(
    nimi => {
      send({
        type: 'SET_VALUES',
        values: { page: 0, nimi: nimi },
      });
    },
    [send]
  );

  const setHakuNimi = useCallback(
    hakuNimi =>
      send({
        type: 'SET_VALUES',
        values: { page: 0, hakuNimi: hakuNimi },
      }),
    [send]
  );

  let setKoulutustyyppi;
  if (name !== ENTITY.HAKU) {
    setKoulutustyyppi = koulutustyyppi =>
      send({
        type: 'SET_VALUES',
        values: { page: 0, koulutustyyppi: koulutustyyppi },
      });
  }

  let setOrgWhitelist;
  if (name === ENTITY.HAKUKOHDE) {
    setOrgWhitelist = orgWhitelist =>
      send({
        type: 'SET_VALUES',
        values: { page: 0, orgWhitelist: orgWhitelist },
      });
  }

  let setHakutapa;
  let setKoulutuksenAlkamiskausi;
  let setKoulutuksenAlkamisvuosi;
  if (name === ENTITY.HAKU) {
    setHakutapa = hakutapa =>
      send({
        type: 'SET_VALUES',
        values: { page: 0, hakutapa: hakutapa },
      });
    setKoulutuksenAlkamiskausi = koulutuksenAlkamiskausi =>
      send({
        type: 'SET_VALUES',
        values: { page: 0, koulutuksenAlkamiskausi: koulutuksenAlkamiskausi },
      });
    setKoulutuksenAlkamisvuosi = koulutuksenAlkamisvuosi =>
      send({
        type: 'SET_VALUES',
        values: { page: 0, koulutuksenAlkamisvuosi: koulutuksenAlkamisvuosi },
      });
  }

  let setNakyvyys;
  if (name === ENTITY.KOULUTUS || name === ENTITY.VALINTAPERUSTE) {
    setNakyvyys = nakyvyys =>
      send({
        type: 'SET_VALUES',
        values: { page: 0, nakyvyys: nakyvyys },
      });
  }

  const setOrderBy = useCallback(
    orderBy =>
      send({
        type: 'SET_VALUES',
        values: { orderBy: orderBy },
      }),
    [send]
  );

  const setPage = useCallback(
    page =>
      send({
        type: 'SET_VALUES',
        values: { page: page },
      }),
    [send]
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
