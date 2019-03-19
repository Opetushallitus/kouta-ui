import get from 'lodash/get';
import pick from 'lodash/pick';

import {
  getKoutaDateString,
  isNumeric,
  formatKoutaDateString,
} from '../../utils';

const DATE_FORMAT = 'DD.MM.YYYY HH:mm';

const getDateTimeValues = dateString => {
  if (!dateString) {
    return { date: '', time: '' };
  }

  const formattedDate = formatKoutaDateString(dateString, DATE_FORMAT);

  const [d = '', t = ''] = formattedDate.split(' ');

  return { date: d, time: t };
};

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

  const ajastettuJulkaisu =
    get(values, 'aikataulut.julkaisu_pvm') &&
    get(values, 'aikataulut.julkaisu_aika')
      ? getKoutaDateStringByDateTime({
          date: values.aikataulut.julkaisu_pvm,
          time: values.aikataulut.julkaisu_aika,
        })
      : null;

  const nimi = pick(get(values, 'nimi.nimi') || null, kielivalinta);

  const kohdejoukkoKoodiUri = get(values, 'kohdejoukko.kohde') || null;

  const kohdejoukonTarkenneKoodiUri = null;

  const metadata = {
    tulevaisuudenAikataulu: (get(values, 'aikataulut.aikataulu') || []).map(
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

  const { date: liittäminen_pvm, time: liittäminen_aika } = getDateTimeValues(
    hakukohteenLiittamisenTakaraja,
  );

  const { date: muokkaus_pvm, time: muokkaus_aika } = getDateTimeValues(
    hakukohteenMuokkaamisenTakaraja,
  );

  const { date: julkaisu_pvm, time: julkaisu_aika } = getDateTimeValues(
    ajastettuJulkaisu,
  );

  return {
    nimi: {
      nimi: nimi,
    },
    kieliversiot: {
      languages: kielivalinta,
    },
    aikataulut: {
      kausi: alkamiskausiKoodiUri,
      vuosi: alkamisvuosi ? alkamisvuosi.toString() : '',
      hakuaika: (hakuajat || []).map(({ alkaa, paattyy }) => {
        const { date: fromDate, time: fromTime } = getDateTimeValues(alkaa);
        const { date: toDate, time: toTime } = getDateTimeValues(paattyy);

        return {
          fromDate,
          fromTime,
          toDate,
          toTime,
        };
      }),
      aikataulu: (tulevaisuudenAikataulu || []).map(({ alkaa, paattyy }) => {
        const { date: fromDate, time: fromTime } = getDateTimeValues(alkaa);
        const { date: toDate, time: toTime } = getDateTimeValues(paattyy);

        return {
          fromDate,
          fromTime,
          toDate,
          toTime,
        };
      }),
      liittäminen_pvm: liittäminen_pvm,
      liittäminen_aika: liittäminen_aika,
      muokkaus_pvm: muokkaus_pvm,
      muokkaus_aika: muokkaus_aika,
      julkaisu_pvm: julkaisu_pvm,
      julkaisu_aika: julkaisu_aika,
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
