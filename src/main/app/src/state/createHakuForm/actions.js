import { getFormValues, startSubmit, stopSubmit } from 'redux-form';
import get from 'lodash/get';

import { JULKAISUTILA, POHJAVALINTA } from '../../constants';
import { openSavingErrorToast, openSavingSuccessToast } from '../toaster';
import getHakuByFormValues from '../../utils/getHakuByFormValues';
import validateHakuForm from '../../utils/validateHakuForm';
import { isNonEmptyObject } from '../../utils';

const formName = 'createHakuForm';
const getHakuFormValues = getFormValues(formName);

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

export const maybeCopy = () => (dispatch, getState) => {
  const values = getHakuFormValues(getState());

  if (
    get(values, 'pohja.tapa') === POHJAVALINTA.KOPIO &&
    !!get(values, 'pohja.valinta.value')
  ) {
    dispatch(copy(values.pohja.valinta.value));
  }
};

export const copy = hakuOid => async (dispatch, getState, { history }) => {
  history.replace({
    search: `?kopioHakuOid=${hakuOid}`,
  });
};

export const submit = ({ tila = JULKAISUTILA.TALLENNETTU } = {}) => async (
  dispatch,
  getState,
  { history },
) => {
  const state = getState();
  const values = getHakuFormValues(state);
  const errors = validateHakuForm({ values, tila });

  dispatch(startSubmit(formName));

  if (isNonEmptyObject(errors)) {
    dispatch(stopSubmit(formName, errors));
    dispatch(openSavingErrorToast());
    return;
  }

  const {
    me: { oid: muokkaaja },
  } = state;

  const { organisaatioOid } = getOidsFromPathname(history.location.pathname);

  const hakuFormData = getHakuByFormValues(values);

  const haku = {
    organisaatioOid,
    muokkaaja,
    tila,
    ...hakuFormData,
  };

  let hakuData;

  try {
    const { data } = await dispatch(saveHaku(haku));

    hakuData = data;
  } catch (e) {
    dispatch(stopSubmit(formName));
    dispatch(openSavingErrorToast());
    return;
  }

  dispatch(stopSubmit(formName));
  dispatch(openSavingSuccessToast());

  if (get(hakuData, 'oid')) {
    const { oid: hakuOid } = hakuData;

    history.push(`/haku/${hakuOid}/muokkaus`);
  } else {
    history.push('/');
  }
};
