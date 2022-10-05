import _ from 'lodash';

import { parseEditorState } from '#/src/components/Editor/utils';
import { FormMode } from '#/src/constants';

export const getTilaisuusValues = ({
  osoite,
  aika,
  lisatietoja,
  jarjestamispaikka,
}) => ({
  osoite: osoite?.osoite || {},
  postinumero: osoite?.postinumeroKoodiUri
    ? { value: osoite.postinumeroKoodiUri }
    : undefined,
  alkaa: aika?.alkaa || '',
  paattyy: aika?.paattyy || '',
  lisatietoja: _.mapValues(lisatietoja || {}, parseEditorState),
  jarjestamispaikka,
});

export const getKokeetTaiLisanaytotValues = (
  valintakokeet = [],
  yleisKuvaus,
  formMode?
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
        id: formMode === FormMode.CREATE ? undefined : id,
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
        tilaisuudet: tilaisuudet.map(getTilaisuusValues),
      })
    ),
  };
};
