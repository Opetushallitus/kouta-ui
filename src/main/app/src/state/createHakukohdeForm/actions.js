import { getFormValues } from 'redux-form';
import get from 'lodash/get';

import { JULKAISUTILA } from '../../constants';
import { createTemporaryToast } from '../toaster';
import { isArray, parseDate } from '../../utils';

const getHakukohdeFormValues = getFormValues('createHakukohdeForm');

const DATE_FORMAT = 'DD.MM.YYYY HH:mm';

const getOidsFromPathname = pathname => {
  const split = pathname.split('/').filter(p => !!p);

  return {
    organisaatioOid: split[1],
    toteutusOid: split[3],
    hakuOid: split[5],
  };
};

export const saveHakukohde = hakukohde => (
  dispatch,
  getState,
  { apiUrls, httpClient },
) => {
  return httpClient.put(apiUrls.url('kouta-backend.hakukohde'), hakukohde);
};

export const submit = ({ tila = JULKAISUTILA.TALLENNETTU } = {}) => async (
  dispatch,
  getState,
  { httpClient, apiUrls, history },
) => {
  const state = getState();
  const values = getHakukohdeFormValues(state);

  const {
    me: { kayttajaOid: muokkaaja },
  } = state;

  const { organisaatioOid, toteutusOid, hakuOid } = getOidsFromPathname(
    history.location.pathname,
  );

  const alkamiskausiKoodiUri = get(values, 'alkamiskausi.kausi') || null;
  const alkamisvuosi = parseInt(get(values, 'alkamiskausi.vuosi'));
  const kielivalinta = get(values, 'kieliversiot.languages') || [];
  const aloituspaikat = parseInt(
    get(values, 'aloituspaikat.aloituspaikkamaara'),
  );
  const kaytetaanHaunAikataulua = !get(values, 'hakuajat.eriHakuaika');

  const hakuajat = (get(values, 'hakuajat.hakuajat') || []).map(
    ({ fromDate, fromTime, toDate, toTime }) => ({
      alkaa: parseDate(`${fromDate} ${fromTime}`, DATE_FORMAT),
      paattyy: parseDate(`${toDate} ${toTime}`, DATE_FORMAT),
    }),
  );

  const liitteidenToimitusosoite = {
    osoite: {
      osoite: get(values, 'liitteet.toimitusosoite') || null,
      postinumero: get(values, 'liitteet.toimituspostinumero') || null,
      postitoimipaikka:
        get(values, 'liitteet.toimituspostitoimipaikka') || null,
    },
    sahkoposti: get(values, 'liitteet.toimitussahkoposti') || null,
  };

  const liitteidenToimitusaika =
    get(values, 'liitteet.deliverDate') && get(values, 'liitteet.deliverTime')
      ? parseDate(
          `${values.liitteet.deliverDate} ${values.liitteet.deliverTime}`,
          DATE_FORMAT,
        )
      : null;

  const liitteetOnkoSamaToimitusosoite = !!get(
    values,
    'liitteet.yhteinenToimituspaikka',
  );

  const liitteetOnkoSamaToimitusaika = !!get(
    values,
    'liitteet.yhteinenToimitusaika',
  );

  const liitteet = (get(values, 'liitteet.liitteet') || []).map(
    ({
      tyyppi,
      nimi,
      kuvaus,
      deliverDate,
      deliverTime,
      toimitusosoite,
      toimituspostinumero,
      toimituspostitoimipaikka,
      toimitussahkoposti,
    }) => ({
      tyyppi: get(tyyppi, 'value') || null,
      nimi: nimi || null,
      toimitusaika: liitteetOnkoSamaToimitusaika
        ? parseDate(`${deliverDate} ${deliverTime}`, DATE_FORMAT)
        : null,
      toimitusosoite: {
        osoite: {
          osoite: toimitusosoite || null,
          postinumero: toimituspostinumero || null,
          postitoimipaikka: toimituspostitoimipaikka || null,
        },
        sahkoposti: toimitussahkoposti || null,
      },
      kuvaus: kuvaus || null,
    }),
  );

  const nimi = get(values, 'perustiedot.nimi') || null;
  const toinenAsteOnkoKaksoistutkinto = !!get(
    values,
    'perustiedot.voiSuorittaaKaksoistutkinnon',
  );
  const valintakoeTyypit = get(values, 'valintakoe.types') || [];
  const valintakokeetByTyyppi = get(values, 'valintakoe.kokeet') || {};

  const valintakokeet = valintakoeTyypit
    .map(tyyppi => ({ tyyppi, ...(valintakokeetByTyyppi[tyyppi] || {}) }))
    .map(({ tyyppi, kokeet }) => ({
      tyyppi,
      tilaisuudet: isArray(kokeet)
        ? kokeet.map(
            ({
              osoite,
              postinumero,
              postitoimipaikka,
              fromDate,
              fromTime,
              toDate,
              toTime,
              lisatietoja,
            }) => ({
              osoite: {
                osoite: osoite || null,
                postinumero: postinumero || null,
                postitoimipaikka: postitoimipaikka || null,
              },
              aika: {
                alkaa: parseDate(`${fromDate} ${fromTime}`, DATE_FORMAT),
                paattyy: parseDate(`${toDate} ${toTime}`, DATE_FORMAT),
              },
              lisatietoja: lisatietoja || null,
            }),
          )
        : [],
    }));

  const pohjakoulutusvaatimusKoodiUri =
    get(values, 'pohjakoulutus.koulutusvaatimus') || null;
  const valintaperuste =
    get(values, 'valintaperusteenKuvaus.valintaperuste.value') || null;

  const hakukohde = {
    alkamiskausiKoodiUri,
    kaytetaanHaunAikataulua,
    kielivalinta,
    aloituspaikat,
    organisaatioOid,
    toteutusOid,
    hakuOid,
    tila,
    hakuajat,
    liitteetOnkoSamaToimitusaika,
    liitteetOnkoSamaToimitusosoite,
    liitteet,
    muokkaaja,
    alkamisvuosi,
    liitteidenToimitusosoite,
    liitteidenToimitusaika,
    nimi,
    toinenAsteOnkoKaksoistutkinto,
    valintakokeet,
    pohjakoulutusvaatimusKoodiUri,
    valintaperuste,
  };

  try {
    await dispatch(saveHakukohde(hakukohde));
  } catch (e) {
    return dispatch(
      createTemporaryToast({
        status: 'danger',
        title: 'Hakukohteen tallennus epäonnistui',
      }),
    );
  }

  dispatch(
    createTemporaryToast({
      status: 'success',
      title: 'Hakukohde on tallennettu onnistuneesti',
    }),
  );

  if (JULKAISUTILA.TALLENNETTU) {
    history.push(`/organisaatio/${organisaatioOid}/valintaperusteet`);
  } else {
    history.push('/');
  }
};
