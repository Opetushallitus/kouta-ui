import React, { useCallback, useMemo, useState } from 'react';

import { useContextOrThrow } from '#/src/hooks/useContextOrThrow';
import {
  loadOrganisaatioFavourites,
  loadOrganisaatioOid,
  saveOrganisaatioFavourites,
  saveOrganisaatioOid,
} from '#/src/utils/organisaatioValintaStorage';

// Valittu organisaatio ja organisaatiosuosikit. Kaksi erillistä contextia, jotta suosikin
// lisäys ei renderöi valintaa lukevia komponentteja uudelleen. Alkutila luetaan
// synkronisesti useStaten alustajassa, ja jokainen muutos kirjoitetaan localStorageen
// asettajassa; mountissa ei kirjoiteta mitään.

type OrganisaatioSelection = {
  organisaatioOid: string | null;
  setOrganisaatioOid: (oid: string) => void;
};

type OrganisaatioFavourites = {
  favourites: Array<string>;
  toggleFavourite: (oid: string) => void;
};

const OrganisaatioSelectionContext = React.createContext<
  OrganisaatioSelection | undefined
>(undefined);
OrganisaatioSelectionContext.displayName = 'OrganisaatioSelectionContext';

const OrganisaatioFavouritesContext = React.createContext<
  OrganisaatioFavourites | undefined
>(undefined);
OrganisaatioFavouritesContext.displayName = 'OrganisaatioFavouritesContext';

export const OrganisaatioValintaProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [organisaatioOid, setOidState] = useState(loadOrganisaatioOid);
  const [favourites, setFavouritesState] = useState(loadOrganisaatioFavourites);

  const setOrganisaatioOid = useCallback((oid: string) => {
    setOidState(oid);
    saveOrganisaatioOid(oid);
  }, []);

  const toggleFavourite = useCallback(
    (oid: string) => {
      const next = favourites.includes(oid)
        ? favourites.filter(o => o !== oid)
        : [...favourites, oid];
      setFavouritesState(next);
      saveOrganisaatioFavourites(next);
    },
    [favourites]
  );

  const selection = useMemo(
    () => ({ organisaatioOid, setOrganisaatioOid }),
    [organisaatioOid, setOrganisaatioOid]
  );
  const favouritesValue = useMemo(
    () => ({ favourites, toggleFavourite }),
    [favourites, toggleFavourite]
  );

  return (
    <OrganisaatioSelectionContext.Provider value={selection}>
      <OrganisaatioFavouritesContext.Provider value={favouritesValue}>
        {children}
      </OrganisaatioFavouritesContext.Provider>
    </OrganisaatioSelectionContext.Provider>
  );
};

export const useOrganisaatioSelection = (): OrganisaatioSelection =>
  useContextOrThrow(OrganisaatioSelectionContext);

export const useSelectedOrganisaatioOid = () =>
  useOrganisaatioSelection().organisaatioOid;

export const useOrganisaatioFavourites = (): OrganisaatioFavourites =>
  useContextOrThrow(OrganisaatioFavouritesContext);
