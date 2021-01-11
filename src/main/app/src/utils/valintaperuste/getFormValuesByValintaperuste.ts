import _ from 'lodash';
import { getKokeetTaiLisanaytotValues } from '#/src/utils/form/getKokeetTaiLisanaytotValues';
import { parseEditorState } from '#/src/components/Editor/utils';

const parseSisalto = ({ sisalto }) => {
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

export const getFormValuesByValintaperuste = valintaperuste => {
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

  const {
    valintatavat = [],
    kuvaus = {},
    valintakokeidenYleiskuvaus,
  } = metadata;

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
      kuvaus: _.mapValues(kuvaus || {}, parseEditorState),
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
        kynnysehto: _.mapValues(kynnysehto || {}, parseEditorState),
        tapa: valintatapaKoodiUri ? { value: valintatapaKoodiUri } : null,
        enimmaispistemaara: enimmaispisteet || '',
        vahimmaispistemaara: vahimmaispisteet || '',
        sisalto: parseSisalto({ sisalto }),
      })
    ),
    soraKuvaus: sorakuvausId
      ? {
          value: sorakuvausId,
        }
      : null,
    valintakokeet: getKokeetTaiLisanaytotValues(
      valintakokeet,
      valintakokeidenYleiskuvaus
    ),
  };
};
