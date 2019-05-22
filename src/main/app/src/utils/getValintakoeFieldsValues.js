import get from 'lodash/get';

export const getValintakoeFieldsValues = valintakokeet => {
  return {
    tyypit: (valintakokeet || []).map(({ tyyppi }) => ({ value: tyyppi })),
    tilaisuudet: (valintakokeet || []).reduce(
      (acc, { tyyppi, tilaisuudet }) => ({
        ...acc,
        [tyyppi]: (tilaisuudet || []).map(({ osoite, aika, lisatietoja }) => ({
          osoite: get(osoite, 'osoite') || {},
          postinumero: get(osoite, 'postinumero') || '',
          postitoimipaikka: get(osoite, 'postitoimipaikka') || {},
          alkaa: get(aika, 'alkaa') || '',
          paattyy: get(aika, 'paattyy') || '',
          lisatietoja: lisatietoja || {},
        })),
      }),
      {},
    ),
  };
};

export default getValintakoeFieldsValues;
