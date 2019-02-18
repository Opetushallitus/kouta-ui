import { getFormValues } from 'redux-form';
import get from 'lodash/get';

import { JULKAISUTILA } from '../../constants';
import { getKoulutusByKoodi } from '../../apiUtils';
import { createTemporaryToast } from '../toaster';
import { getKoulutusByValues } from './utils';

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

export const submit = ({
  tila = JULKAISUTILA.TALLENNETTU,
  redirect = true,
} = {}) => async (dispatch, getState, { httpClient, apiUrls, history }) => {
  const state = getState();
  const values = getKoulutusFormValues(state);

  const organisaatioOid = getOrganisaatioOidFromPathname(
    history.location.pathname,
  );

  const {
    me: { kayttajaOid },
  } = state;

  const koulutusFormData = getKoulutusByValues(values);

  const { nimi = null } = await getKoulutusByKoodi({
    koodiUri: koulutusFormData.koulutusKoodiUri,
    httpClient,
    apiUrls,
  });

  const koulutus = {
    organisaatioOid,
    muokkaaja: kayttajaOid,
    tila,
    nimi,
    johtaaTutkintoon: true,
    ...koulutusFormData,
  };

  let koulutusData;

  try {
    const { data } = await dispatch(saveKoulutus(koulutus));

    koulutusData = data;
  } catch (e) {
    return dispatch(
      createTemporaryToast({
        status: 'danger',
        title: 'Koulutuksen talennus epäonnistui',
      }),
    );
  }

  dispatch(
    createTemporaryToast({
      status: 'success',
      title: 'Koulutus on tallennettu onnistuneesti',
    }),
  );

  if (!redirect) {
    return koulutusData;
  }

  if (get(koulutusData, 'oid')) {
    const { oid: koulutusOid } = koulutusData;

    history.push(
      `/koulutus/${koulutusOid}/muokkaus?scrollTarget=koulutukseen-liitetetyt-toteutukset`,
    );
  } else {
    history.push('/');
  }

  return koulutusData;
};

export const maybeCopy = () => (dispatch, getState) => {
  const values = getKoulutusFormValues(getState());

  if (
    get(values, 'base.base') === 'copy_koulutus' &&
    !!get(values, 'base.education.value')
  ) {
    dispatch(copy(values.base.education.value));
  }
};

export const copy = koulutusOid => async (dispatch, getState, { history }) => {
  history.replace({
    search: `?kopioKoulutusOid=${koulutusOid}`,
  });
};
