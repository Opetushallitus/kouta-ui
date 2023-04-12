import _ from 'lodash';

import { parseEditorState } from '#/src/components/Editor/utils';
import { FormMode, JULKAISUTILA, KOULUTUSTYYPPI } from '#/src/constants';
import { ValintaperusteModel } from '#/src/types/domainTypes';
import { ValintaperusteValues } from '#/src/types/valintaperusteTypes';
import { toEnumValue, toSelectValue } from '#/src/utils';
import { getKokeetTaiLisanaytotValues } from '#/src/utils/form/getKokeetTaiLisanaytotValues';
import { parseSisaltoField } from '#/src/utils/form/parseSisaltoField';

export const getFormValuesByValintaperuste = (
  valintaperuste: ValintaperusteModel,
  formMode?: FormMode
): ValintaperusteValues => {
  const {
    hakutapaKoodiUri = null,
    kielivalinta = [],
    kohdejoukkoKoodiUri = null,
    nimi = {},
    metadata = {},
    koulutustyyppi = null,
    julkinen = false,
    tila,
    valintakokeet,
    esikatselu = false,
    externalId,
    organisaatioOid,
  } = valintaperuste;

  const {
    valintatavat = [],
    kuvaus = {},
    sisalto = [],
    valintakokeidenYleiskuvaus,
    hakukelpoisuus = {},
    lisatiedot = {},
  } = metadata;

  return {
    organisaatioOid: toSelectValue(organisaatioOid),
    externalId,
    tila: toEnumValue(JULKAISUTILA, tila),
    perustiedot: {
      tyyppi: toEnumValue(KOULUTUSTYYPPI, koulutustyyppi),
      kieliversiot: kielivalinta,
      hakutapa: hakutapaKoodiUri,
      kohdejoukko: kohdejoukkoKoodiUri ? { value: kohdejoukkoKoodiUri } : null,
    },
    julkinen,
    kuvaus: {
      nimi,
      kuvaus: _.mapValues(kuvaus || {}, parseEditorState),
      sisalto: parseSisaltoField(sisalto),
    },
    hakukelpoisuus: _.mapValues(hakukelpoisuus || {}, parseEditorState),
    lisatiedot: _.mapValues(lisatiedot || {}, parseEditorState),
    valintatavat: (valintatavat || []).map(
      ({
        nimi: valintatapaNimi,
        sisalto: valintatapaSisalto,
        valintatapaKoodiUri,
        kynnysehto,
        enimmaispisteet,
        vahimmaispisteet,
      }) => ({
        nimi: valintatapaNimi || {},
        sisalto: parseSisaltoField(valintatapaSisalto),
        tapa: valintatapaKoodiUri ? { value: valintatapaKoodiUri } : null,
        kynnysehto: _.mapValues(kynnysehto || {}, parseEditorState),
        enimmaispistemaara:
          _.toString(enimmaispisteet)?.replace('.', ',') || '',
        vahimmaispistemaara:
          _.toString(vahimmaispisteet)?.replace('.', ',') || '',
      })
    ),
    valintakokeet: getKokeetTaiLisanaytotValues(
      valintakokeet,
      valintakokeidenYleiskuvaus,
      formMode
    ),
    esikatselu,
  };
};
