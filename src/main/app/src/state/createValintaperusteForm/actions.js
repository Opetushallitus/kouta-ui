import { getFormValues } from 'redux-form';
import get from 'lodash/get';

import { JULKAISUTILA } from '../../constants';
import { createTemporaryToast } from '../toaster';
import { getValintaperusteByValues } from './utils';

const getValintaperusteFormValues = getFormValues('createValintaperusteForm');

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

  const valintaperusteFormData = getValintaperusteByValues(values);

  const {
    me: { kayttajaOid: muokkaaja },
  } = state;

  const { organisaatioOid } = getOidsFromPathname(history.location.pathname);

  const valintaperuste = {
    tila,
    muokkaaja,
    organisaatioOid,
    ...valintaperusteFormData,
  };

  let valintaperusteData;

  try {
    const { data } = await dispatch(saveValintaperuste(valintaperuste));

    valintaperusteData = data;
  } catch (e) {
    return dispatch(
      createTemporaryToast({
        status: 'danger',
        title: 'Valintaperusteen tallennus epäonnistui',
      }),
    );
  }

  dispatch(
    createTemporaryToast({
      status: 'success',
      title: 'Valintaperuste on tallennettu onnistuneesti',
    }),
  );

  if (get(valintaperusteData, 'oid')) {
    const { oid: valintaperusteOid } = valintaperusteData;

    history.push(`/valintaperuste/${valintaperusteOid}/muokkaus`);
  } else {
    history.push('/');
  }
};

export const maybeCopy = () => (dispatch, getState) => {
  const values = getValintaperusteFormValues(getState());

  if (
    get(values, 'pohja.pohja') === 'copy_valintaperuste' &&
    !!get(values, 'pohja.valintaperuste.value')
  ) {
    dispatch(copy(values.pohja.valintaperuste.value));
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
