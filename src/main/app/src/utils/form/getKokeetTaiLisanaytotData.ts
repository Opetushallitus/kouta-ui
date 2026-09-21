import { get, isEmpty } from 'lodash-es';

import {
  isNumeric,
  parseFloatComma,
  toKielistettyWithValueStr,
} from '#/src/utils';

export const getTilaisuusData =
  (kieleistykset, kieleistyksetSerialized) =>
  ({
    osoite,
    postinumero,
    alkaa,
    paattyy,
    lisatietoja,
    jarjestamispaikka,
  }) => ({
    osoite: {
      osoite: kieleistykset(osoite),
      postinumeroKoodiUri: kieleistykset(
        toKielistettyWithValueStr(postinumero)
      ),
    },
    aika: {
      alkaa: alkaa,
      paattyy: paattyy,
    },
    lisatietoja: kieleistyksetSerialized(lisatietoja),
    jarjestamispaikka: kieleistykset(jarjestamispaikka),
  });

export const getKokeetTaiLisanaytotData = ({
  valintakoeValues = {},
  kieleistykset,
  kieleistyksetSerialized,
}) => {
  const kokeetTaiLisanaytot = get(valintakoeValues, 'kokeetTaiLisanaytot');
  if (isEmpty(kokeetTaiLisanaytot)) {
    return undefined;
  }

  return (kokeetTaiLisanaytot || []).map(
    ({
      id,
      tyyppi,
      nimi,
      tietoaHakijalle,
      vahimmaispistemaara,
      liittyyEnnakkovalmistautumista,
      ohjeetEnnakkovalmistautumiseen,
      erityisjarjestelytMahdollisia,
      ohjeetErityisjarjestelyihin,
      tilaisuudet = [],
    }) => ({
      id,
      tyyppiKoodiUri: get(tyyppi, 'value'),
      nimi: kieleistykset(nimi),
      metadata: {
        tietoja: kieleistyksetSerialized(tietoaHakijalle),
        vahimmaispisteet: isNumeric(vahimmaispistemaara)
          ? parseFloatComma(vahimmaispistemaara)
          : null,
        // Ohjeet kuuluvat rastin mukana: ilman rastia kenttä on piilossa, joten sen
        // arvo on kuollutta dataa. Rekisteröintiin perustuva piilotettujen nollaus ei
        // yksin riitä, koska kenttä ei mounttaudu lainkaan, jos rasti on jo pois
        // lomaketta avattaessa - silloin vanha teksti kulkisi initialValuesista
        // payloadiin. Konfo näyttää ohjeet pelkän tyhjyystarkistuksen perusteella.
        liittyyEnnakkovalmistautumista,
        ohjeetEnnakkovalmistautumiseen: liittyyEnnakkovalmistautumista
          ? kieleistyksetSerialized(ohjeetEnnakkovalmistautumiseen)
          : {},
        erityisjarjestelytMahdollisia,
        ohjeetErityisjarjestelyihin: erityisjarjestelytMahdollisia
          ? kieleistyksetSerialized(ohjeetErityisjarjestelyihin)
          : {},
      },
      tilaisuudet: tilaisuudet.map(
        getTilaisuusData(kieleistykset, kieleistyksetSerialized)
      ),
    })
  );
};
