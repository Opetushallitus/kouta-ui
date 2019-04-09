import { getFormValues, startSubmit, stopSubmit } from 'redux-form';
import get from 'lodash/get';

import { JULKAISUTILA } from '../../constants';
import { createSavingErrorToast, createSavingSuccessToast } from '../toaster';
import { getHakukohdeByValues, validate } from './utils';
import { isNonEmptyObject } from '../../utils';

const formName = 'createHakukohdeForm';
const getHakukohdeFormValues = getFormValues(formName);

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
  const errors = validate({ values, tila });

  dispatch(startSubmit(formName));

  if (isNonEmptyObject(errors)) {
    dispatch(stopSubmit(formName, errors));
    dispatch(createSavingErrorToast());
    return;
  }

  const {
    me: { oid: muokkaaja },
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
    dispatch(stopSubmit(formName));
    dispatch(createSavingErrorToast());
    return;
  }

  dispatch(stopSubmit(formName));
  dispatch(createSavingSuccessToast());

  if (get(hakukohdeData, 'oid')) {
    history.push(`/hakukohde/${hakukohdeData.oid}/muokkaus`);
  } else {
    history.push('/');
  }
};
