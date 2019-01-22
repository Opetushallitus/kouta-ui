import { getFormValues } from 'redux-form';
import get from 'lodash/get';
import toPairs from 'lodash/toPairs';
import flatMap from 'lodash/flatMap';

import { JULKAISUTILA } from '../../constants';
import { createTemporaryToast } from '../toaster';

const getToteutusFormValues = getFormValues('createToteutusForm');

const getOidsFromPathname = pathname => {
  const split = pathname.split('/').filter(p => !!p);

  return {
    organisaatioOid: split[1],
    koulutusOid: split[3],
  };
};

export const saveToteutus = toteutus => (
  dispatch,
  getState,
  { apiUrls, httpClient },
) => {
  return httpClient.put(apiUrls.url('kouta-backend.toteutus'), toteutus);
};

export const submit = ({ tila = JULKAISUTILA.TALLENNETTU } = {}) => async (
  dispatch,
  getState,
  { httpClient, apiUrls, history },
) => {
  const state = getState();
  const values = getToteutusFormValues(state);

  const {
    me: { kayttajaOid: muokkaaja },
  } = state;

  const { koulutusOid, organisaatioOid } = getOidsFromPathname(
    history.location.pathname,
  );
  const tarjoajat = get(values, 'jarjestamispaikat.jarjestajat') || [];
  const kielivalinta = get(values, 'kieliversiot.languages') || [];
  const nimi = get(values, 'nimi.name') || {};
  const opetuskielet = get(values, 'jarjestamistiedot.opetuskieli') || [];
  const kuvaus = get(values, 'jarjestamistiedot.kuvaus') || {};
  const osioKuvaukset = get(values, 'jarjestamistiedot.osioKuvaukset') || {};

  const osiot = (get(values, 'jarjestamistiedot.osiot') || []).map(osio => ({
    otsikko: {
      fi: osio.label,
    },
    teksti: osioKuvaukset[osio.value] || {},
  }));

  const onkoMaksullinen =
    get(values, 'jarjestamistiedot.maksullisuus') === 'kylla';
  const maksunMaara = get(values, 'jarjestamistiedot.maksumaara') || {};

  const osaamisalaLinkit = get(values, 'osaamisalat.osaamisalaLinkit') || {};
  const osaamisalaLinkkiOtsikot =
    get(values, 'osaamisalat.osaamisalaLinkkiOtsikot') || {};

  const osaamisalat = (get(values, 'osaamisalat.osaamisalat') || []).map(
    osaamisala => ({
      koodi: osaamisala,
      linkki: osaamisalaLinkit[osaamisala] || {},
      otsikko: osaamisalaLinkkiOtsikot[osaamisala] || {},
    }),
  );

  const yhteystieto = {
    nimi: get(values, 'yhteystiedot.name') || {},
    titteli: get(values, 'yhteystiedot.title') || {},
    sahkoposti: get(values, 'yhteystiedot.email') || {},
    puhelinnumero: get(values, 'yhteystiedot.phone') || {},
  };

  const ammattinimikkeet = flatMap(
    toPairs(get(values, 'nayttamistiedot.ammattinimikkeet') || {}),
    ([language, nimikkeet]) => {
      return (nimikkeet || []).map(({ value }) => ({
        kieli: language,
        arvo: value,
      }));
    },
  );

  const asiasanat = flatMap(
    toPairs(get(values, 'nayttamistiedot.avainsanat') || {}),
    ([language, sanat]) => {
      return (sanat || []).map(({ value }) => ({
        kieli: language,
        arvo: value,
      }));
    },
  );

  const toteutus = {
    tila,
    muokkaaja,
    organisaatioOid,
    koulutusOid,
    nimi,
    tarjoajat,
    kielivalinta,
    metadata: {
      opetus: {
        osiot,
        opetuskielet,
        kuvaus,
        onkoMaksullinen,
        maksunMaara,
      },
      osaamisalat,
      yhteystieto,
      ammattinimikkeet,
      asiasanat,
    },
  };

  await dispatch(saveToteutus(toteutus));

  dispatch(
    createTemporaryToast({
      status: 'success',
      title: 'Toteutus on tallennettu onnistuneesti',
    }),
  );

  if (JULKAISUTILA.JULKAISTU) {
    history.push(`/organisaatio/${organisaatioOid}/haku`);
  } else {
    history.push('/');
  }
};
