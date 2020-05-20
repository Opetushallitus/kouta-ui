import _ from 'lodash';
import serializeEditorState from './draft/serializeEditorState';

const getKokeetTaiLisanaytotData = ({
  valintakoeValues = [],
  kielivalinta,
}) => {
  const kokeetTaiLisanaytot = _.get(valintakoeValues, 'kokeetTaiLisanaytot');

  return (kokeetTaiLisanaytot || []).map(
    ({
      tyyppi,
      nimi,
      tietoaHakijalle,
      liittyyEnnakkovalmistautumista,
      ohjeetEnnakkovalmistautumiseen,
      erityisjarjestelytMahdollisia,
      ohjeetErityisjarjestelyihin,
      tilaisuudet = [],
    }) => ({
      tyyppiKoodiUri: _.get(tyyppi, 'value'),
      nimi: nimi,
      tietoa: serializeEditorState(tietoaHakijalle),
      liittyyEnnakkovalmistautumista,
      ohjeetEnnakkovalmistautumiseen: serializeEditorState(
        ohjeetEnnakkovalmistautumiseen
      ),
      erityisjarjestelytMahdollisia,
      ohjeetErityisjarjestelyihin: serializeEditorState(
        ohjeetErityisjarjestelyihin
      ),
      tilaisuudet: tilaisuudet.map(
        ({
          osoite,
          postinumero,
          alkaa,
          paattyy,
          lisatiedot,
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
          lisatietoja: _.pick(lisatiedot || {}, kielivalinta),
          jarjestamispaikka,
        })
      ),
    })
  );
};

export default getKokeetTaiLisanaytotData;
