import { getFormValues, startSubmit, stopSubmit } from 'redux-form';
import get from 'lodash/get';
import produce from 'immer';

import { JULKAISUTILA, POHJAVALINTA } from '../../constants';
import { openSavingErrorToast, openSavingSuccessToast } from '../toaster';
import { getValintaperusteByValues, validate } from './utils';
import { isNonEmptyObject } from '../../utils';

const formName = 'createValintaperusteForm';
const getValintaperusteFormValues = getFormValues(formName);

const getOidsFromPathname = pathname => {
  const split = pathname.split('/').filter(p => !!p);

  return {
    organisaatioOid: split[1],
  };
};

export const saveValintaperuste = valintaperuste => (
  dispatch,
  getState,
  { apiUrls, httpClient },
) => {
  return httpClient.put(
    apiUrls.url('kouta-backend.valintaperuste'),
    valintaperuste,
  );
};

export const submit = ({ tila = JULKAISUTILA.TALLENNETTU } = {}) => async (
  dispatch,
  getState,
  { history },
) => {
  const state = getState();
  const values = getValintaperusteFormValues(state);
  const errors = validate({ values, tila });

  dispatch(startSubmit(formName));

  if (isNonEmptyObject(errors)) {
    dispatch(stopSubmit(formName, errors));
    dispatch(openSavingErrorToast());
    return;
  }

  const valintaperusteFormData = getValintaperusteByValues(values);

  const {
    me: { oid: muokkaaja },
  } = state;

  const { organisaatioOid } = getOidsFromPathname(history.location.pathname);

  const {
    metadata: { koulutustyyppi = null },
  } = valintaperusteFormData;

  const valintaperuste = produce(
    {
      tila,
      muokkaaja,
      organisaatioOid,
      ...valintaperusteFormData,
    },
    draft => {
      draft.koulutustyyppi = koulutustyyppi;
    },
  );

  let valintaperusteData;

  try {
    const { data } = await dispatch(saveValintaperuste(valintaperuste));

    valintaperusteData = data;
  } catch (e) {
    dispatch(stopSubmit(formName));
    dispatch(openSavingErrorToast());
    return;
  }

  dispatch(stopSubmit(formName));
  dispatch(openSavingSuccessToast());

  if (get(valintaperusteData, 'id')) {
    const { id: valintaperusteOid } = valintaperusteData;

    history.push(`/valintaperusteet/${valintaperusteOid}/muokkaus`);
  } else {
    history.push('/');
  }
};

export const maybeCopy = () => (dispatch, getState) => {
  const values = getValintaperusteFormValues(getState());

  if (
    get(values, 'pohja.tapa') === POHJAVALINTA.KOPIO &&
    !!get(values, 'pohja.valinta.value')
  ) {
    dispatch(copy(values.pohja.valinta.value));
  }
};

export const copy = valintaperusteOid => async (
  dispatch,
  getState,
  { history },
) => {
  history.replace({
    search: `?kopioValintaperusteOid=${valintaperusteOid}`,
  });
};
