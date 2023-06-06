import _ from 'lodash';

import { serializeEditorState } from '#/src/components/Editor/utils';
import { isNumeric, parseFloatComma } from '#/src/utils';

export const getTilaisuusData =
  kielivalinta =>
  ({
    osoite,
    postinumero,
    alkaa,
    paattyy,
    lisatietoja,
    jarjestamispaikka,
  }) => ({
    osoite: {
      osoite: _.pick(osoite || {}, kielivalinta),
      postinumeroKoodiUri: _.get(postinumero, 'value'),
    },
    aika: {
      alkaa: alkaa,
      paattyy: paattyy,
    },
    lisatietoja: _.mapValues(
      _.pick(lisatietoja || {}, kielivalinta),
      serializeEditorState
    ),
    jarjestamispaikka: _.pick(jarjestamispaikka || {}, kielivalinta),
  });

export const getKokeetTaiLisanaytotData = ({
  valintakoeValues = {},
  kielivalinta,
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
      nimi: _.pick(nimi || {}, kielivalinta),
      metadata: {
        tietoja: _.mapValues(
          _.pick(tietoaHakijalle || {}, kielivalinta),
          serializeEditorState
        ),
        vahimmaispisteet: isNumeric(vahimmaispistemaara)
          ? parseFloatComma(vahimmaispistemaara)
          : null,
        liittyyEnnakkovalmistautumista,
        ohjeetEnnakkovalmistautumiseen: _.mapValues(
          _.pick(ohjeetEnnakkovalmistautumiseen || {}, kielivalinta),
          serializeEditorState
        ),
        erityisjarjestelytMahdollisia,
        ohjeetErityisjarjestelyihin: _.mapValues(
          _.pick(ohjeetErityisjarjestelyihin || {}, kielivalinta),
          serializeEditorState
        ),
      },
      tilaisuudet: tilaisuudet.map(getTilaisuusData(kielivalinta)),
    })
  );
};
