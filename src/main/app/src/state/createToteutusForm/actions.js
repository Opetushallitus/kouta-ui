import { getFormValues } from 'redux-form';
import get from 'lodash/get';
import produce from 'immer';

import { JULKAISUTILA, POHJAVALINNAT } from '../../constants';
import { createTemporaryToast } from '../toaster';
import { getToteutusByValues } from './utils';
import { KOULUTUSTYYPPI_CATEGORY } from '../../constants';

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

export const submit = ({
  tila = JULKAISUTILA.TALLENNETTU,
  koulutustyyppi = KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS,
} = {}) => async (dispatch, getState, { history }) => {
  const state = getState();
  const values = getToteutusFormValues(state);

  const {
    me: { kayttajaOid: muokkaaja },
  } = state;

  const { koulutusOid, organisaatioOid } = getOidsFromPathname(
    history.location.pathname,
  );

  const toteutusFormData = getToteutusByValues(values);

  const toteutus = produce(
    {
      tila,
      muokkaaja,
      organisaatioOid,
      koulutusOid,
      ...toteutusFormData,
    },
    draft => {
      draft.metadata.tyyppi = koulutustyyppi;
    },
  );

  let toteutusData;

  try {
    const { data } = await dispatch(saveToteutus(toteutus));

    toteutusData = data;
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

  if (get(toteutusData, 'oid')) {
    const { oid: toteutusOid } = toteutusData;

    history.push(`/toteutus/${toteutusOid}/muokkaus`);
  } else {
    history.push('/');
  }
};

export const maybeCopy = () => (dispatch, getState) => {
  const values = getToteutusFormValues(getState());

  if (
    get(values, 'base.pohja.tapa') === POHJAVALINNAT.KOPIO &&
    !!get(values, 'base.pohja.valinta')
  ) {
    dispatch(copy(values.base.pohja.valinta.value));
  }
};

export const copy = toteutusOid => async (dispatch, getState, { history }) => {
  history.replace({
    search: `?kopioToteutusOid=${toteutusOid}`,
  });
};
