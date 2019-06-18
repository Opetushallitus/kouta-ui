import { getFormValues, stopSubmit, startSubmit } from 'redux-form';
import get from 'lodash/get';

import { JULKAISUTILA, POHJAVALINTA } from '../../constants';
import { openSavingErrorToast, openSavingSuccessToast } from '../toaster';
import getKoulutusByFormValues from '../../utils/getKoulutusByFormValues';
import validateKoulutusForm from '../../utils/validateKoulutusForm';
import { isNonEmptyObject } from '../../utils';
import createKoulutus from '../../utils/kouta/createKoulutus';

const getKoulutusFormValues = getFormValues('createKoulutusForm');

const getOrganisaatioOidFromPathname = pathname => {
  const split = pathname.split('/').filter(p => !!p);

  return split[1];
};

export const saveKoulutus = koulutus => (
  dispatch,
  getState,
  { apiUrls, httpClient },
) => {
  return createKoulutus({ httpClient, apiUrls, koulutus });
};

export const submit = ({ tila = JULKAISUTILA.TALLENNETTU } = {}) => async (
  dispatch,
  getState,
  { history },
) => {
  const state = getState();
  const values = getKoulutusFormValues(state);
  const koulutusFormData = getKoulutusByFormValues(values);

  const errors = validateKoulutusForm({
    values,
    tila,
    koulutustyyppi: koulutusFormData.koulutustyyppi,
  });

  dispatch(startSubmit('createKoulutusForm'));

  if (isNonEmptyObject(errors)) {
    dispatch(stopSubmit('createKoulutusForm', errors));
    dispatch(openSavingErrorToast());

    return;
  }

  const organisaatioOid = getOrganisaatioOidFromPathname(
    history.location.pathname,
  );

  const {
    me: { oid: kayttajaOid },
  } = state;

  const koulutus = {
    organisaatioOid,
    muokkaaja: kayttajaOid,
    tila,
    johtaaTutkintoon: true,
    ...koulutusFormData,
  };

  let koulutusData;

  try {
    koulutusData = await dispatch(saveKoulutus(koulutus));
  } catch (e) {
    dispatch(stopSubmit('createKoulutusForm'));
    dispatch(openSavingErrorToast());
    return;
  }

  dispatch(stopSubmit('createKoulutusForm'));
  dispatch(openSavingSuccessToast());

  if (get(koulutusData, 'oid')) {
    const { oid: koulutusOid } = koulutusData;

    history.push(`/koulutus/${koulutusOid}/muokkaus`);
  } else {
    history.push('/');
  }

  return koulutusData;
};

export const copy = koulutusOid => async (dispatch, getState, { history }) => {
  history.replace({
    search: `?kopioKoulutusOid=${koulutusOid}`,
  });
};

export const maybeCopy = () => (dispatch, getState) => {
  const values = getKoulutusFormValues(getState());

  if (
    get(values, 'pohja.tapa') === POHJAVALINTA.KOPIO &&
    !!get(values, 'pohja.valinta')
  ) {
    dispatch(copy(values.pohja.valinta.value));
  }
};
