import _ from 'lodash';

import { parseEditorState } from '#/src/components/LexicalEditorUI/utils';
import { FormMode } from '#/src/constants';
import {
  ValintakoetilaisuusModel,
  Valintakokeet,
} from '#/src/types/domainTypes';
import { ValintakokeetValues } from '#/src/types/formTypes';
import { toSelectValue, toKielistettyWithValueField } from '#/src/utils';

export const getTilaisuusValues = ({
  osoite,
  aika,
  lisatietoja,
  jarjestamispaikka,
}: ValintakoetilaisuusModel) => ({
  osoite: osoite?.osoite || {},
  postinumero: toKielistettyWithValueField(osoite?.postinumeroKoodiUri),
  alkaa: aika?.alkaa || '',
  paattyy: aika?.paattyy || '',
  lisatietoja: _.mapValues(lisatietoja || {}, parseEditorState),
  jarjestamispaikka,
});

export const getKokeetTaiLisanaytotValues = (
  valintakokeet: Valintakokeet = [],
  yleisKuvaus?: TranslatedField,
  formMode?: FormMode
): ValintakokeetValues => {
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
        tyyppi: toSelectValue(tyyppiKoodiUri),
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
        tilaisuudet: tilaisuudet?.map(getTilaisuusValues),
      })
    ),
  };
};
