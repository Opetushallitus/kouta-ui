import { getFormValues } from 'redux-form';
import get from 'lodash/get';

import { getKoulutusByValues } from '../createKoulutusForm';
import { getKoulutusByKoodi, updateKoutaKoulutus } from '../../apiUtils';
import { createTemporaryToast } from '../toaster';
import { isNonEmptyObject } from '../../utils';

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
    lastModified,
    oid: koulutusOid,
    muokkaaja: kayttajaOid,
    johtaaTutkintoon: true,
    ...(tila && { tila }),
    ...(organisaatioOid && { organisaatioOid }),
    ...koulutusFormData,
    nimi,
  };

  let koulutusData;

  try {
    const { data } = await dispatch(saveKoulutus(koulutus));

    koulutusData = data;
  } catch (e) {
    return dispatch(
      createTemporaryToast({
        status: 'danger',
        title: 'Koulutuksen tallennus epäonnistui',
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
