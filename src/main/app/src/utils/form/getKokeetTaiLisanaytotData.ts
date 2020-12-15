import _ from 'lodash';
import { serializeEditorState } from '#/src/components/Editor/utils';

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
      tilaisuudet: tilaisuudet.map(
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
        })
      ),
    })
  );
};
