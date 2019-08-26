import mapValues from 'lodash/mapValues';

import { isObject, isArray } from './index';
import parseEditorState from './draft/parseEditorState';

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
  } = valintaperuste;

  const { valintatavat = [], kuvaus = {}, sorakuvausId } = metadata;

  return {
    kieliversiot: kielivalinta,
    hakutapa: hakutapaKoodiUri,
    kohdejoukko: kohdejoukkoKoodiUri ? { value: kohdejoukkoKoodiUri } : null,
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
    tyyppi: koulutustyyppi,
    soraKuvaus: sorakuvausId
      ? {
          value: sorakuvausId,
        }
      : null,
  };
};

export default getFormValuesByValintaperuste;
