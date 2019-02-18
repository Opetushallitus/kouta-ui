import get from 'lodash/get';

export const getValuesByHaku = haku => {
  const {
    alkamiskausiKoodiUri = '',
    hakutapaKoodiUri = '',
    kohdejoukkoKoodiUri = '',
    hakulomaketyyppi = '',
    kielivalinta = [],
    nimi = {},
    metadata = {},
  } = haku;

  const { yhteystieto = {} } = metadata;

  return {
    nimi: {
      nimi: nimi,
    },
    kieliversiot: {
      languages: kielivalinta,
    },
    aikataulut: {
      kausi: alkamiskausiKoodiUri,
    },
    hakutapa: {
      tapa: hakutapaKoodiUri,
    },
    kohdejoukko: {
      kohde: kohdejoukkoKoodiUri,
    },
    hakulomake: {
      lomaketyyppi: hakulomaketyyppi,
    },
    yhteystieto: {
      nimi: get(yhteystieto, 'nimi') || {},
      titteli: get(yhteystieto, 'titteli') || {},
      sahkoposti: get(yhteystieto, 'sahkoposti') || {},
      puhelinnumero: get(yhteystieto, 'puhelinnumero') || {},
    },
  };
};
