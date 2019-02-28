import get from 'lodash/get';
import pick from 'lodash/pick';

import { getKoutaDateString, isNumeric } from '../../utils';

const getKoutaDateStringByDateTime = ({ date = '', time = '' }) => {
  const [day, month, year] = date.split('.');

  if (!isNumeric(day) || !isNumeric(month) || !isNumeric(year)) {
    return null;
  }

  const [hour, minute] = time.split(':');

  return getKoutaDateString({
    day,
    month,
    year,
    hour: hour || 0,
    minute: minute || 0,
  });
};

export const getHakuByValues = values => {
  const alkamiskausiKoodiUri = get(values, 'aikataulut.kausi') || null;
  const alkamisvuosi = parseInt(get(values, 'aikataulut.vuosi'));
  const kielivalinta = get(values, 'kieliversiot.languages') || [];

  const hakutapaKoodiUri = get(values, 'hakutapa.tapa') || null;

  const hakuajat = (get(values, 'aikataulut.hakuaika') || []).map(
    ({ fromDate, fromTime, toDate, toTime }) => ({
      alkaa: getKoutaDateStringByDateTime({
        date: fromDate,
        time: fromTime,
      }),
      paattyy: getKoutaDateStringByDateTime({
        date: toDate,
        time: toTime,
      }),
    }),
  );

  const hakulomaketyyppi = get(values, 'hakulomake.lomaketyyppi') || null;

  const hakulomake = get(values, 'hakulomake.lomake') || null;

  const hakukohteenLiittamisenTakaraja =
    get(values, 'aikataulut.liittäminen_pvm') &&
    get(values, 'aikataulut.liittäminen_aika')
      ? getKoutaDateStringByDateTime({
          date: values.aikataulut.liittäminen_pvm,
          time: values.aikataulut.liittäminen_aika,
        })
      : null;

  const nimi = pick(get(values, 'nimi.nimi') || null, kielivalinta);

  const kohdejoukkoKoodiUri = get(values, 'kohdejoukko.kohde') || null;

  const kohdejoukonTarkenneKoodiUri = null;

  const metadata = {
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
    get(values, 'aikataulut.muokkaus_pvm') &&
    get(values, 'aikataulut.muokkaus_aika')
      ? getKoutaDateStringByDateTime({
          date: values.aikataulut.muokkaus_pvm,
          time: values.aikataulut.muokkaus_aika,
        })
      : null;

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
    alkamisvuosi,
    hakulomake,
  };
};

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
