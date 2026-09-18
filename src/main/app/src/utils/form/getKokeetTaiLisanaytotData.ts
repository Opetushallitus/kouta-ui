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
        liittyyEnnakkovalmistautumista,
        ohjeetEnnakkovalmistautumiseen: kieleistyksetSerialized(
          ohjeetEnnakkovalmistautumiseen
        ),
        erityisjarjestelytMahdollisia,
        ohjeetErityisjarjestelyihin: kieleistyksetSerialized(
          ohjeetErityisjarjestelyihin
        ),
      },
      tilaisuudet: tilaisuudet.map(
        getTilaisuusData(kieleistykset, kieleistyksetSerialized)
      ),
    })
  );
};
