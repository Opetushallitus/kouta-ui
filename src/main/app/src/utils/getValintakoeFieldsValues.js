import { get } from 'lodash';

export const getValintakoeFieldsValues = valintakokeet => {
  return {
    tyypit: (valintakokeet || []).map(({ tyyppiKoodiUri }) => ({
      value: tyyppiKoodiUri,
    })),
    tilaisuudet: (valintakokeet || []).reduce(
      (acc, { tyyppiKoodiUri, tilaisuudet }) => ({
        ...acc,
        [tyyppiKoodiUri]: (tilaisuudet || []).map(
          ({ osoite, aika, lisatietoja }) => ({
            osoite: get(osoite, 'osoite') || {},
            postinumero: get(osoite, 'postinumeroKoodiUri')
              ? { value: osoite.postinumeroKoodiUri }
              : undefined,
            alkaa: get(aika, 'alkaa') || '',
            paattyy: get(aika, 'paattyy') || '',
            lisatietoja: lisatietoja || {},
          }),
        ),
      }),
      {},
    ),
  };
};

export default getValintakoeFieldsValues;
