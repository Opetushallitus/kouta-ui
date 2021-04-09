import { useMemo } from 'react';

import { useKoodit } from '#/src/hooks/useKoodit';
import { getPostinumeroByPostinumeroUri } from '#/src/utils';
import { getPostinumeroKoodiLabel } from '#/src/utils/koodi/postinumero';

export const useReadonlyKokeetJaTilaisuudet = (
  tilaisuudet: Array<any>,
  language: LanguageCode
) => {
  // NOTE: Etsitään tarvittavat postinumerokoodit käännöstä varten
  const neededPostinumeros = useMemo(
    () => tilaisuudet.map(v => v.osoite?.postinumeroKoodiUri).filter(Boolean),
    [tilaisuudet]
  );
  const { koodit } = useKoodit(neededPostinumeros);

  const usedTilaisuudet = useMemo(
    () =>
      tilaisuudet.map(t => {
        // Jos tilaisuudella on postinumerokoodi, haetaan käännös osaksi näytettävää tekstiä
        const koodiUri = t.osoite?.postinumeroKoodiUri;
        const koodi = koodiUri && koodit[neededPostinumeros.indexOf(koodiUri)];
        return _.set(
          t,
          'osoite.postinumero',
          koodiUri
            ? koodi
              ? getPostinumeroKoodiLabel(koodi, language) // Näytetään pelkkä postinumero kunnes useKoodit on palauttanut käännökset
              : getPostinumeroByPostinumeroUri(koodiUri)
            : null
        );
      }),
    [neededPostinumeros, koodit, language, tilaisuudet]
  );

  return { tilaisuudet: usedTilaisuudet };
};
