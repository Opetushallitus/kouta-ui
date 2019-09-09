import get from 'lodash/get';
import pick from 'lodash/pick';

const getValintakoeFieldsData = ({ valintakoeValues, kielivalinta }) => {
  return (get(valintakoeValues, 'tyypit') || []).map(({ value }) => ({
    tyyppi: value,
    tilaisuudet: (get(valintakoeValues, ['tilaisuudet', value]) || []).map(
      ({ osoite, postinumero, alkaa, paattyy, lisatietoja }) => ({
        osoite: {
          osoite: pick(osoite || {}, kielivalinta),
          postinumeroKoodiUri: get(postinumero, 'value') || null,
        },
        aika: {
          alkaa: alkaa || null,
          paattyy: paattyy || null,
        },
        lisatietoja: pick(lisatietoja || {}, kielivalinta),
      }),
    ),
  }));
};

export default getValintakoeFieldsData;
