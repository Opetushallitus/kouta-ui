import { getFormValues } from 'redux-form';
import get from 'lodash/get';

import { getKoulutusByValues } from '../createKoulutusForm';
import { getKoulutusByKoodi, updateKoutaKoulutus } from '../../apiUtils';
import { createTemporaryToast } from '../toaster';

const getKoulutusFormValues = getFormValues('editKoulutusForm');

export const saveKoulutus = koulutus => (
  dispatch,
  getState,
  { apiUrls, httpClient },
) => {
  return updateKoutaKoulutus({ httpClient, apiUrls, koulutus });
};

export const submit = ({
  koulutusOid,
  organisaatioOid,
  tila,
  lastModified,
}) => async (dispatch, getState, { history, apiUrls, httpClient }) => {
  const state = getState();
  const values = getKoulutusFormValues(state);

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
    lastModified,
    oid: koulutusOid,
    muokkaaja: kayttajaOid,
    nimi,
    johtaaTutkintoon: true,
    ...(tila && { tila }),
    ...(organisaatioOid && { organisaatioOid }),
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

  history.push(`/koulutus/${koulutusOid}/muokkaus`, {
    koulutusUpdatedAt: Date.now(),
  });

  return koulutusData;
};

export const attachToteutus = ({ organisaatioOid, koulutusOid }) => async (
  dispatch,
  getState,
  { history },
) => {
  const values = getKoulutusFormValues(getState());

  const kopioToteutusOid =
    get(values, 'toteutukset.pohja') === 'copy_toteutus'
      ? get(values, 'toteutukset.toteutus.value')
      : null;

  if (kopioToteutusOid) {
    history.push(
      `/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/toteutus?kopioToteutusOid=${kopioToteutusOid}`,
    );
  } else {
    history.push(
      `/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/toteutus`,
    );
  }
};
