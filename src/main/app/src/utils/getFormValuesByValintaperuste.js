import { isArray, isObject, mapValues } from 'lodash';
import parseEditorState from './draft/parseEditorState';
import getValintakoeFieldsValues from './getValintakoeFieldsValues';

const parseSisalto = ({ sisalto }) => {
  if (!isArray(sisalto)) {
    return [];
  }

  return sisalto.map(({ tyyppi, data }) => {
    if (tyyppi === 'teksti') {
      return {
        tyyppi,
        data: isObject(data) ? mapValues(data, parseEditorState) : {},
      };
    }

    return { tyyppi, data };
  });
};

const getFormValuesByValintaperuste = valintaperuste => {
  const {
    hakutapaKoodiUri = null,
    kielivalinta = [],
    kohdejoukkoKoodiUri = null,
    nimi = {},
    metadata = {},
    koulutustyyppi = null,
    onkoJulkinen = false,
    tila,
    sorakuvausId,
    valintakokeet,
  } = valintaperuste;

  const { valintatavat = [], kuvaus = {} } = metadata;

  return {
    tila,
    perustiedot: {
      tyyppi: koulutustyyppi,
      kieliversiot: kielivalinta,
      hakutapa: hakutapaKoodiUri,
      kohdejoukko: kohdejoukkoKoodiUri ? { value: kohdejoukkoKoodiUri } : null,
    },
    julkinen: onkoJulkinen,
    kuvaus: {
      nimi,
      kuvaus: mapValues(kuvaus || {}, parseEditorState),
    },
    valintatavat: (valintatavat || []).map(
      ({
        kuvaus,
        nimi,
        valintatapaKoodiUri,
        sisalto,
        kynnysehto,
        enimmaispisteet,
        vahimmaispisteet,
      }) => ({
        kuvaus: kuvaus || {},
        nimi: nimi || {},
        kynnysehto: kynnysehto || {},
        tapa: valintatapaKoodiUri ? { value: valintatapaKoodiUri } : null,
        enimmaispistemaara: enimmaispisteet || '',
        vahimmaispistemaara: vahimmaispisteet || '',
        sisalto: parseSisalto({ sisalto }),
      }),
    ),
    soraKuvaus: sorakuvausId
      ? {
          value: sorakuvausId,
        }
      : null,
    valintakoe: getValintakoeFieldsValues(valintakokeet),
  };
};

export default getFormValuesByValintaperuste;
