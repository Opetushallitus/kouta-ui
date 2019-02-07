import { getFormValues, initialize } from 'redux-form';

import { JULKAISUTILA } from '../../constants';
import { createTemporaryToast } from '../toaster';
import { getToteutusByValues, getValuesByToteutus } from './utils';
import { getKoutaToteutusByOid } from '../../apiUtils';

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

  const toteutusFormData = getToteutusByValues(values);

  const toteutus = {
    tila,
    muokkaaja,
    organisaatioOid,
    koulutusOid,
    ...toteutusFormData,
  };

  try {
    await dispatch(saveToteutus(toteutus));
  } catch (e) {
    return dispatch(
      createTemporaryToast({
        status: 'danger',
        title: 'Toteutuksen tallennus epäonnistui',
      }),
    );
  }

  dispatch(
    createTemporaryToast({
      status: 'success',
      title: 'Toteutus on tallennettu onnistuneesti',
    }),
  );

  if (JULKAISUTILA.TALLENNETTU) {
    history.push(`/organisaatio/${organisaatioOid}/haku`);
  } else {
    history.push('/');
  }
};

export const copy = toteutusOid => async (
  dispatch,
  getState,
  { apiUrls, httpClient },
) => {
  const toteutus = await getKoutaToteutusByOid({
    oid: toteutusOid,
    httpClient,
    apiUrls,
  });

  dispatch(initialize('createToteutusForm', getValuesByToteutus(toteutus)));
};
