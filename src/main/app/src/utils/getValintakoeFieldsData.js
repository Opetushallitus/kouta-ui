import get from 'lodash/get';
import pick from 'lodash/pick';

const getValintakoeFieldsData = ({ valintakoeValues, kielivalinta }) => {
  return (get(valintakoeValues, 'tyypit') || []).map(({ value }) => ({
    tyyppi: value,
    tilaisuudet: (get(valintakoeValues, ['tilaisuudet', value]) || []).map(
      ({
        osoite,
        postinumero,
        postitoimipaikka,
        alkaa,
        paattyy,
        lisatietoja,
      }) => ({
        osoite: {
          osoite: pick(osoite || {}, kielivalinta),
          postinumero: postinumero || null,
          postitoimipaikka: pick(postitoimipaikka || {}, kielivalinta),
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
