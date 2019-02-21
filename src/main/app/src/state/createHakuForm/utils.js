import get from 'lodash/get';
import pick from 'lodash/pick';

import { parseDate, toKoutaDateString } from '../../utils';

export const getHakuByValues = values => {
  const DATE_FORMAT = 'DD.MM.YYYY HH:mm';

  const alkamiskausiKoodiUri = get(values, 'aikataulut.kausi') || null;
  const alkamisvuosi = parseInt(get(values, 'aikataulut.vuosi'));
  const kielivalinta = get(values, 'kieliversiot.languages') || [];

  const hakutapaKoodiUri = get(values, 'hakutapa.tapa') || null;

  const hakuajat = (get(values, 'aikataulut.hakuaika') || []).map(
    ({ fromDate, fromTime, toDate, toTime }) => ({
      alkaa: toKoutaDateString(
        parseDate(`${fromDate} ${fromTime}`, DATE_FORMAT),
      ),
      paattyy: toKoutaDateString(parseDate(`${toDate} ${toTime}`, DATE_FORMAT)),
    }),
  );

  const hakulomaketyyppi = get(values, 'hakulomake.lomaketyyppi') || null;

  const hakulomake = get(values, 'hakulomake.lomake') || null;

  const hakukohteenLiittamisenTakaraja =
    get(values, 'aikataulut.liittäminen_pvm') &&
    get(values, 'aikataulut.liittäminen_aika')
      ? toKoutaDateString(
          parseDate(
            `${values.aikataulut.liittäminen_pvm} ${
              values.aikataulut.liittäminen_aika
            }`,
            DATE_FORMAT,
          ),
        )
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
      ? toKoutaDateString(
          parseDate(
            `${values.aikataulut.muokkaus_pvm} ${
              values.aikataulut.muokkaus_aika
            }`,
            DATE_FORMAT,
          ),
        )
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
