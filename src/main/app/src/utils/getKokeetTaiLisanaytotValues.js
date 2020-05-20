import { get } from 'lodash';
import parseEditorState from './draft/parseEditorState';

export const getKokeetTaiLisanaytotValues = (valintakokeet = [], kuvaus) => {
  return {
    kuvaus,
    kokeetTaiLisanaytot: valintakokeet.map(
      ({
        tyyppiKoodiUri,
        tilaisuudet,
        nimi,
        tietoa,
        liittyyEnnakkovalmistautumista,
        ohjeetEnnakkovalmistautumiseen,
        erityisjarjestelytMahdollisia,
        ohjeetErityisjarjestelyihin,
      }) => ({
        tyyppi: { value: tyyppiKoodiUri },
        nimi,
        liittyyEnnakkovalmistautumista,
        ohjeetEnnakkovalmistautumiseen: parseEditorState(
          ohjeetEnnakkovalmistautumiseen
        ),
        erityisjarjestelytMahdollisia,
        ohjeetErityisjarjestelyihin: parseEditorState(
          ohjeetErityisjarjestelyihin
        ),
        tietoaHakijalle: parseEditorState(tietoa),
        tilaisuudet: tilaisuudet.map(({ osoite, aika, lisatietoja }) => ({
          osoite: get(osoite, 'osoite') || {},
          postinumero: get(osoite, 'postinumeroKoodiUri')
            ? { value: osoite.postinumeroKoodiUri }
            : undefined,
          alkaa: get(aika, 'alkaa') || '',
          paattyy: get(aika, 'paattyy') || '',
          lisatietoja: lisatietoja || {},
        })),
      })
    ),
  };
};

export default getKokeetTaiLisanaytotValues;
