import get from 'lodash/get';
import pick from 'lodash/pick';

import { isNumeric } from '../../utils';

export const getHakuByValues = values => {
  const alkamiskausiKoodiUri = get(values, 'aikataulut.kausi') || null;

  const alkamisvuosi = isNumeric(get(values, 'aikataulut.vuosi.value'))
    ? parseInt(values.aikataulut.vuosi.value)
    : null;

  const kielivalinta = get(values, 'kieliversiot.languages') || [];

  const hakutapaKoodiUri = get(values, 'hakutapa.tapa') || null;

  const hakuajat = (get(values, 'aikataulut.hakuaika') || []).map(
    ({ alkaa, paattyy }) => ({
      alkaa: alkaa || null,
      paattyy: paattyy || null,
    }),
  );

  const hakulomaketyyppi = get(values, 'hakulomake.lomaketyyppi') || null;

  const hakulomake = get(values, 'hakulomake.lomake') || null;

  const hakukohteenLiittamisenTakaraja =
    get(values, 'aikataulut.lisaamisenTakaraja') || null;

  const ajastettuJulkaisu = get(values, 'aikataulut.ajastettuJulkaisu') || null;

  const nimi = pick(get(values, 'nimi.nimi') || null, kielivalinta);

  const kohdejoukkoKoodiUri = get(values, 'kohdejoukko.kohde') || null;

  const kohdejoukonTarkenneKoodiUri = null;

  const metadata = {
    tulevaisuudenAikataulu: (get(values, 'aikataulut.aikataulu') || []).map(
      ({ alkaa, paattyy }) => ({
        alkaa: alkaa || null,
        paattyy: paattyy || null,
      }),
    ),
    yhteystieto: {
      nimi: pick(get(values, 'yhteystiedot.nimi') || null, kielivalinta),
      titteli: pick(get(values, 'yhteystiedot.titteli') || null, kielivalinta),
      sahkoposti: pick(get(values, 'yhteystiedot.email') || null, kielivalinta),
      puhelinnumero: pick(
        get(values, 'yhteystiedot.puhelin') || null,
        kielivalinta,
      ),
    },
  };

  const hakukohteenMuokkaamisenTakaraja =
    get(values, 'aikataulut.muokkauksenTakaraja') || null;

  return {
    alkamiskausiKoodiUri,
    kielivalinta,
    hakutapaKoodiUri,
    hakuajat,
    hakukohteenLiittamisenTakaraja,
    nimi,
    kohdejoukkoKoodiUri,
    kohdejoukonTarkenneKoodiUri,
    hakulomaketyyppi,
    metadata,
    hakukohteenMuokkaamisenTakaraja,
    ajastettuJulkaisu,
    alkamisvuosi,
    hakulomake,
  };
};

export const getValuesByHaku = haku => {
  const {
    alkamiskausiKoodiUri = '',
    alkamisvuosi = '',
    hakuajat = [],
    hakutapaKoodiUri = '',
    kohdejoukkoKoodiUri = '',
    hakulomaketyyppi = '',
    hakukohteenLiittamisenTakaraja,
    hakukohteenMuokkaamisenTakaraja,
    ajastettuJulkaisu,
    kielivalinta = [],
    nimi = {},
    metadata = {},
  } = haku;

  const { yhteystieto = {} } = metadata;

  const { tulevaisuudenAikataulu = [] } = metadata;

  return {
    nimi: {
      nimi: nimi,
    },
    kieliversiot: {
      languages: kielivalinta,
    },
    aikataulut: {
      kausi: alkamiskausiKoodiUri,
      vuosi: { value: alkamisvuosi ? alkamisvuosi.toString() : '' },
      hakuaika: (hakuajat || []).map(({ alkaa, paattyy }) => {
        return {
          alkaa,
          paattyy,
        };
      }),
      aikataulu: (tulevaisuudenAikataulu || []).map(({ alkaa, paattyy }) => {
        return {
          alkaa,
          paattyy,
        };
      }),
      lisaamisenTakaraja: hakukohteenLiittamisenTakaraja,
      muokkauksenTakaraja: hakukohteenMuokkaamisenTakaraja,
      ajastettuJulkaisu,
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
    yhteystiedot: {
      nimi: get(yhteystieto, 'nimi') || {},
      titteli: get(yhteystieto, 'titteli') || {},
      email: get(yhteystieto, 'sahkoposti') || {},
      puhelin: get(yhteystieto, 'puhelinnumero') || {},
    },
  };
};
