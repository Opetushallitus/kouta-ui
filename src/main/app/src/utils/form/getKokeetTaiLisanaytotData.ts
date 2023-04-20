import _ from 'lodash';

import { serializeEditorState } from '#/src/components/LexicalEditorUI/utils';
import { isNumeric, parseFloatComma } from '#/src/utils';

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
      postinumeroKoodiUri: _.get(postinumero, 'value'),
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
  const kokeetTaiLisanaytot = _.get(valintakoeValues, 'kokeetTaiLisanaytot');
  if (_.isEmpty(kokeetTaiLisanaytot)) {
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
      tyyppiKoodiUri: _.get(tyyppi, 'value'),
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
