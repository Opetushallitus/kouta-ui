import { get, pick } from 'lodash';

import { isNumeric } from './index';
import getHakulomakeFieldsData from './getHakulomakeFieldsData';
import isKorkeakoulutusKohdejoukkoKoodiUri from './isKorkeakoulutusKohdejoukkoKoodiUri';

const getKielivalinta = values => get(values, 'kieliversiot') || [];

const getHakuByFormValues = values => {
  const { muokkaaja, tila } = values;
  const alkamiskausiKoodiUri = get(values, 'aikataulut.kausi') || null;

  const alkamisvuosi = isNumeric(get(values, 'aikataulut.vuosi.value'))
    ? parseInt(values.aikataulut.vuosi.value)
    : null;

  const kielivalinta = getKielivalinta(values);

  const hakutapaKoodiUri = get(values, 'hakutapa') || null;

  const hakuajat = (get(values, 'aikataulut.hakuaika') || []).map(
    ({ alkaa, paattyy }) => ({
      alkaa: alkaa || null,
      paattyy: paattyy || null,
    })
  );

  const {
    hakulomaketyyppi,
    hakulomakeAtaruId,
    hakulomakeLinkki,
    hakulomakeKuvaus,
  } = getHakulomakeFieldsData({
    hakulomakeValues: get(values, 'hakulomake'),
    kielivalinta,
  });

  const hakukohteenLiittamisenTakaraja =
    get(values, 'aikataulut.lisaamisenTakaraja') || null;

  const ajastettuJulkaisu = get(values, 'aikataulut.ajastettuJulkaisu') || null;

  const nimi = pick(get(values, 'nimi'), kielivalinta);

  const kohdejoukkoKoodiUri = get(values, 'kohdejoukko.kohdejoukko') || null;

  const kohdejoukonTarkenneKoodiUri = isKorkeakoulutusKohdejoukkoKoodiUri(
    kohdejoukkoKoodiUri
  )
    ? get(values, 'kohdejoukko.tarkenne.value') || null
    : null;

  const metadata = {
    tulevaisuudenAikataulu: (get(values, 'aikataulut.aikataulu') || []).map(
      ({ alkaa, paattyy }) => ({
        alkaa: alkaa || null,
        paattyy: paattyy || null,
      })
    ),
    yhteyshenkilot: (get(values, 'yhteyshenkilot') || []).map(
      ({ nimi, titteli, puhelinnumero, sahkoposti, verkkosivu }) => ({
        nimi: pick(nimi || {}, kielivalinta),
        titteli: pick(titteli || {}, kielivalinta),
        puhelinnumero: pick(puhelinnumero || {}, kielivalinta),
        wwwSivu: pick(verkkosivu || {}, kielivalinta),
        sahkoposti: pick(sahkoposti || {}, kielivalinta),
      })
    ),
  };

  const hakukohteenMuokkaamisenTakaraja =
    get(values, 'aikataulut.muokkauksenTakaraja') || null;

  return {
    muokkaaja,
    tila,
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
    hakulomakeAtaruId,
    hakulomakeLinkki,
    hakulomakeKuvaus,
  };
};

export default getHakuByFormValues;
