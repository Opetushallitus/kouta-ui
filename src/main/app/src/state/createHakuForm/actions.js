import { getFormValues } from 'redux-form';
import get from 'lodash/get';

import { JULKAISUTILA, POHJAVALINNAT } from '../../constants';
import { createTemporaryToast } from '../toaster';
import { getHakuByValues } from './utils';

const getHakuFormValues = getFormValues('createHakuForm');

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
    get(values, 'pohja.pohja.tapa') === POHJAVALINNAT.KOPIO &&
    !!get(values, 'pohja.pohja.valinta.value')
  ) {
    dispatch(copy(values.pohja.pohja.valinta.value));
  }
};

export const copy = hakuOid => async (dispatch, getState, { history }) => {
  history.replace({
    search: `?kopioHakuOid=${hakuOid}`,
  });
};

export const submit = ({
  tila = JULKAISUTILA.TALLENNETTU,
  redirect = true,
} = {}) => async (dispatch, getState, { httpClient, apiUrls, history }) => {
  const state = getState();
  const values = getHakuFormValues(state);

  const {
    me: { kayttajaOid: muokkaaja },
  } = state;

  const { organisaatioOid } = getOidsFromPathname(history.location.pathname);

  const hakuFormData = getHakuByValues(values);

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

  if (!redirect) {
    return hakuData;
  }

  if (get(hakuData, 'oid')) {
    const { oid: hakuOid } = hakuData;

    history.push(`/haku/${hakuOid}/muokkaus?scrollTarget=liitetyt-hakukohteet`);
  } else {
    history.push('/');
  }
};
