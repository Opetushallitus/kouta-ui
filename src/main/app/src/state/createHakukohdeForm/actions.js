import { getFormValues } from 'redux-form';
import get from 'lodash/get';

import { JULKAISUTILA } from '../../constants';
import { createTemporaryToast } from '../toaster';
import { getHakukohdeByValues } from './utils';

const getHakukohdeFormValues = getFormValues('createHakukohdeForm');

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
  { history },
) => {
  const state = getState();
  const values = getHakukohdeFormValues(state);

  const {
    me: { kayttajaOid: muokkaaja },
  } = state;

  const { organisaatioOid, toteutusOid, hakuOid } = getOidsFromPathname(
    history.location.pathname,
  );

  const formData = getHakukohdeByValues(values);

  const hakukohde = {
    ...formData,
    organisaatioOid,
    toteutusOid,
    hakuOid,
    tila,
    muokkaaja,
  };

  let hakukohdeData;

  try {
    const { data } = await dispatch(saveHakukohde(hakukohde));

    hakukohdeData = data;
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

  if (get(hakukohdeData, 'oid')) {
    history.push(`/hakukohde/${hakukohdeData.oid}/muokkaus`);
  } else {
    history.push('/');
  }
};
