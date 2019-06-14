import { getFormValues, startSubmit, stopSubmit } from 'redux-form';
import get from 'lodash/get';
import produce from 'immer';

import { JULKAISUTILA, POHJAVALINTA } from '../../constants';
import { openSavingErrorToast, openSavingSuccessToast } from '../toaster';
import { getToteutusByValues, validate } from './utils';
import { KOULUTUSTYYPPI } from '../../constants';
import { isNonEmptyObject } from '../../utils';

const formName = 'createToteutusForm';
const getToteutusFormValues = getFormValues(formName);

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
  koulutustyyppi = KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
} = {}) => async (dispatch, getState, { history, localisation }) => {
  const state = getState();
  const values = getToteutusFormValues(state);
  const errors = validate({ values, tila, koulutustyyppi });

  dispatch(startSubmit(formName));

  if (isNonEmptyObject(errors)) {
    dispatch(stopSubmit(formName, errors));
    dispatch(openSavingErrorToast());
    return;
  }

  const {
    me: { oid: muokkaaja },
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
    dispatch(stopSubmit(formName));
    dispatch(openSavingErrorToast());
    return;
  }

  dispatch(stopSubmit(formName));
  dispatch(openSavingSuccessToast());

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
    get(values, 'pohja.tapa') === POHJAVALINTA.KOPIO &&
    !!get(values, 'pohja.valinta')
  ) {
    dispatch(copy(values.pohja.valinta.value));
  }
};

export const copy = toteutusOid => async (dispatch, getState, { history }) => {
  history.replace({
    search: `?kopioToteutusOid=${toteutusOid}`,
  });
};
