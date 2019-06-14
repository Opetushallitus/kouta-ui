import { getFormValues, startSubmit, stopSubmit } from 'redux-form';
import get from 'lodash/get';

import { JULKAISUTILA } from '../../constants';
import { openSavingErrorToast, openSavingSuccessToast } from '../toaster';
import getHakukohdeByFormValues from '../../utils/getHakukohdeByFormValues';
import validateHakukohdeForm from '../../utils/validateHakukohdeForm';
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
  const errors = validateHakukohdeForm({ values, tila });

  dispatch(startSubmit(formName));

  if (isNonEmptyObject(errors)) {
    dispatch(stopSubmit(formName, errors));
    dispatch(openSavingErrorToast());
    return;
  }

  const {
    me: { oid: muokkaaja },
  } = state;

  const { organisaatioOid, toteutusOid, hakuOid } = getOidsFromPathname(
    history.location.pathname,
  );

  const formData = getHakukohdeByFormValues(values);

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
    dispatch(openSavingErrorToast());
    return;
  }

  dispatch(stopSubmit(formName));
  dispatch(openSavingSuccessToast());

  if (get(hakukohdeData, 'oid')) {
    history.push(`/hakukohde/${hakukohdeData.oid}/muokkaus`);
  } else {
    history.push('/');
  }
};
