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

  // Funktionaalinen päivitys, jotta peräkkäiset kutsut samassa tapahtumassa eivät
  // laske seuraavaa tilaa samasta vanhentuneesta listasta. Kirjoitus päivittäjän sisällä
  // on idempotentti, joten StrictModen tuplakutsu ei haittaa.
  const toggleFavourite = useCallback((oid: string) => {
    setFavouritesState(favourites => {
      const next = favourites.includes(oid)
        ? favourites.filter(o => o !== oid)
        : [...favourites, oid];
      saveOrganisaatioFavourites(next);
      return next;
    });
  }, []);

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
