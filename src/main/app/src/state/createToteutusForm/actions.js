import { getFormValues } from 'redux-form';
import get from 'lodash/get';

import { JULKAISUTILA } from '../../constants';

const getToteutusFormValues = getFormValues('createToteutusForm');

const getKoulutusOidFromPathname = pathname => {
  const split = pathname.split('/').filter(p => !!p);

  return split[1];
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

  const koulutusOid = getKoulutusOidFromPathname(history.location.pathname);

  const organisaatioOid = '';
  const tarjoajat = get(values, 'jarjestamispaikat.jarjestajat') || [];
  const kielivalinta = get(values, 'kieliversiot.languages') || [];
  const nimi = get(values, 'nimi.name') || {};
  const opetuskielet = get(values, 'jarjestamistiedot.opetuskieli') || [];
  const kuvaus = get(values, 'jarjestamistiedot.kuvaus') || {};
  const osioKuvaukset = get(values, 'jarjestamistiedot.osioKuvaukset') || {};

  const osiot = (get(values, 'jarjestamistiedot.osiot') || []).map(osio => ({
    teksti: osioKuvaukset[osio] || {},
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

  const toteutus = {
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
    },
  };

  console.log(toteutus);
};
