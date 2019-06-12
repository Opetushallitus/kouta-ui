import { getFormValues, stopSubmit, startSubmit } from 'redux-form';
import get from 'lodash/get';

import { JULKAISUTILA, POHJAVALINTA } from '../../constants';
import { getKoulutusByKoodi } from '../../apiUtils';
import { createSavingErrorToast, createSavingSuccessToast } from '../toaster';
import { getKoulutusByValues, validate } from './utils';
import { isNonEmptyObject } from '../../utils';

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
  return httpClient.put(apiUrls.url('kouta-backend.koulutus'), koulutus);
};

export const submit = ({ tila = JULKAISUTILA.TALLENNETTU } = {}) => async (
  dispatch,
  getState,
  { httpClient, apiUrls, history },
) => {
  const state = getState();
  const values = getKoulutusFormValues(state);
  const koulutusFormData = getKoulutusByValues(values);

  const errors = validate({
    values,
    tila,
    koulutustyyppi: koulutusFormData.koulutustyyppi,
  });

  dispatch(startSubmit('createKoulutusForm'));

  if (isNonEmptyObject(errors)) {
    dispatch(stopSubmit('createKoulutusForm', errors));
    dispatch(createSavingErrorToast());

    return;
  }

  const organisaatioOid = getOrganisaatioOidFromPathname(
    history.location.pathname,
  );

  const {
    me: { oid: kayttajaOid },
  } = state;

  let nimi = koulutusFormData.nimi;

  if (!isNonEmptyObject(nimi) && koulutusFormData.koulutusKoodiUri) {
    const { nimi: koulutusNimi } = await getKoulutusByKoodi({
      koodiUri: koulutusFormData.koulutusKoodiUri,
      httpClient,
      apiUrls,
    });

    nimi = koulutusNimi;
  }

  const koulutus = {
    organisaatioOid,
    muokkaaja: kayttajaOid,
    tila,
    johtaaTutkintoon: true,
    ...koulutusFormData,
    nimi,
  };

  let koulutusData;

  try {
    const { data } = await dispatch(saveKoulutus(koulutus));

    koulutusData = data;
  } catch (e) {
    dispatch(stopSubmit('createKoulutusForm'));
    dispatch(createSavingErrorToast());
    return;
  }

  dispatch(stopSubmit('createKoulutusForm'));
  dispatch(createSavingSuccessToast());

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
    get(values, 'base.pohja.tapa') === POHJAVALINTA.KOPIO &&
    !!get(values, 'base.pohja.valinta')
  ) {
    dispatch(copy(values.base.pohja.valinta.value));
  }
};
