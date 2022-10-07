import _ from 'lodash';

import { parseEditorState } from '#/src/components/Editor/utils';
import { toSelectValue } from '#/src/utils';
import { getKokeetTaiLisanaytotValues } from '#/src/utils/form/getKokeetTaiLisanaytotValues';

const parseSisalto = sisalto => {
  if (!_.isArray(sisalto)) {
    return [];
  }

  return sisalto.map(({ tyyppi, data }) => {
    if (tyyppi === 'teksti') {
      return {
        tyyppi,
        data: _.isObject(data) ? _.mapValues(data, parseEditorState) : {},
      };
    }

    return { tyyppi, data };
  });
};

export const getFormValuesByValintaperuste = (valintaperuste, formMode) => {
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
    tila,
    perustiedot: {
      tyyppi: koulutustyyppi,
      kieliversiot: kielivalinta,
      hakutapa: hakutapaKoodiUri,
      kohdejoukko: kohdejoukkoKoodiUri ? { value: kohdejoukkoKoodiUri } : null,
    },
    julkinen,
    kuvaus: {
      nimi,
      kuvaus: _.mapValues(kuvaus || {}, parseEditorState),
      sisalto: parseSisalto(sisalto),
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
        sisalto: parseSisalto(valintatapaSisalto),
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
