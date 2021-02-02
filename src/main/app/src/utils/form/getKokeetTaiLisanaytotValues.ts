import _ from 'lodash';
import { parseEditorState } from '#/src/components/Editor/utils';

export const getKokeetTaiLisanaytotValues = (
  valintakokeet = [],
  yleisKuvaus
) => {
  return {
    yleisKuvaus: _.mapValues(yleisKuvaus, kuvaus => parseEditorState(kuvaus)),
    kokeetTaiLisanaytot: valintakokeet.map(
      ({
        id,
        tyyppiKoodiUri,
        tilaisuudet,
        nimi,
        metadata: {
          tietoja,
          vahimmaispisteet,
          liittyyEnnakkovalmistautumista,
          ohjeetEnnakkovalmistautumiseen,
          erityisjarjestelytMahdollisia,
          ohjeetErityisjarjestelyihin,
        } = {},
      }) => ({
        id,
        tyyppi: { value: tyyppiKoodiUri },
        nimi,
        liittyyEnnakkovalmistautumista,
        ohjeetEnnakkovalmistautumiseen: _.mapValues(
          ohjeetEnnakkovalmistautumiseen,
          parseEditorState
        ),
        erityisjarjestelytMahdollisia,
        ohjeetErityisjarjestelyihin: _.mapValues(
          ohjeetErityisjarjestelyihin,
          parseEditorState
        ),
        tietoaHakijalle: _.mapValues(tietoja, parseEditorState),
        vahimmaispistemaara:
          _.toString(vahimmaispisteet)?.replace('.', ',') || '',
        tilaisuudet: tilaisuudet.map(
          ({ osoite, aika, lisatietoja, jarjestamispaikka }) => ({
            osoite: _.get(osoite, 'osoite') || {},
            postinumero: _.get(osoite, 'postinumeroKoodiUri')
              ? { value: osoite.postinumeroKoodiUri }
              : undefined,
            alkaa: _.get(aika, 'alkaa') || '',
            paattyy: _.get(aika, 'paattyy') || '',
            lisatietoja: _.mapValues(lisatietoja || {}, parseEditorState),
            jarjestamispaikka,
          })
        ),
      })
    ),
  };
};
