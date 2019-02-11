import { getFormValues } from 'redux-form';
import get from 'lodash/get';
import pick from 'lodash/pick';

import { JULKAISUTILA } from '../../constants';
import { createTemporaryToast } from '../toaster';
import { parseDate, toKoutaDateString } from '../../utils';

const getHakuFormValues = getFormValues('createHakuForm');

const DATE_FORMAT = 'DD.MM.YYYY HH:mm';

const getOidsFromPathname = pathname => {
  const split = pathname.split('/').filter(p => !!p);

  return {
    organisaatioOid: split[1],
  };
};

export const saveHaku = haku => (
  dispatch,
  getState,
  { apiUrls, httpClient },
) => {
  return httpClient.put(apiUrls.url('kouta-backend.haku'), haku);
};

export const submit = ({ tila = JULKAISUTILA.TALLENNETTU } = {}) => async (
  dispatch,
  getState,
  { httpClient, apiUrls, history },
) => {
  const state = getState();
  const values = getHakuFormValues(state);

  const {
    me: { kayttajaOid: muokkaaja },
  } = state;

  const { organisaatioOid } = getOidsFromPathname(history.location.pathname);

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

  const hakulomaketyyppi = pick(
    get(values, 'hakulomake.lomaketyyppi') || null,
    kielivalinta,
  );

  const hakulomake = pick(
    get(values, 'hakulomake.lomake') || null,
    kielivalinta,
  );

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
        get(values, 'yhteystiedot.numero') || null,
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

  const haku = {
    organisaatioOid,
    alkamiskausiKoodiUri,
    kielivalinta,
    tila,
    hakutapaKoodiUri,
    hakuajat,
    hakukohteenLiittamisenTakaraja,
    nimi,
    kohdejoukkoKoodiUri,
    kohdejoukonTarkenneKoodiUri,
    hakulomaketyyppi,
    muokkaaja,
    metadata,
    hakukohteenMuokkaamisenTakaraja,
    alkamisvuosi,
    hakulomake,
  };

  try {
    await dispatch(saveHaku(haku));
  } catch (e) {
    return dispatch(
      createTemporaryToast({
        status: 'danger',
        title: 'Haun tallennus epäonnistui',
      }),
    );
  }

  dispatch(
    createTemporaryToast({
      status: 'success',
      title: 'Haku on tallennettu onnistuneesti',
    }),
  );

  if (JULKAISUTILA.TALLENNETTU) {
    history.push(`/organisaatio/${organisaatioOid}/haku`);
  } else {
    history.push('/');
  }
};
