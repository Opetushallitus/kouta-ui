import _ from 'lodash';

import { serializeEditorState } from '#/src/components/LexicalEditorUI/utils';
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
    lisatietoja: _.mapValues(lisatietoja || {}, serializeEditorState),
    jarjestamispaikka,
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
      nimi: nimi,
      metadata: {
        tietoja: _.mapValues(tietoaHakijalle, serializeEditorState),
        vahimmaispisteet: isNumeric(vahimmaispistemaara)
          ? parseFloatComma(vahimmaispistemaara)
          : null,
        liittyyEnnakkovalmistautumista,
        ohjeetEnnakkovalmistautumiseen: _.mapValues(
          ohjeetEnnakkovalmistautumiseen,
          serializeEditorState
        ),
        erityisjarjestelytMahdollisia,
        ohjeetErityisjarjestelyihin: _.mapValues(
          ohjeetErityisjarjestelyihin,
          serializeEditorState
        ),
      },
      tilaisuudet: tilaisuudet.map(getTilaisuusData(kielivalinta)),
    })
  );
};
