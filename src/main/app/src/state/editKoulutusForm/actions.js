import { getFormValues, stopSubmit, startSubmit } from 'redux-form';
import produce from 'immer';

import { getKoulutusByValues, validate } from '../createKoulutusForm';
import { getKoulutusByKoodi, updateKoutaKoulutus } from '../../apiUtils';
import { openSavingErrorToast, openSavingSuccessToast } from '../toaster';
import { isNonEmptyObject } from '../../utils';

const getKoulutusFormValues = getFormValues('editKoulutusForm');

export const saveKoulutus = koulutus => (
  dispatch,
  getState,
  { apiUrls, httpClient },
) => {
  return updateKoutaKoulutus({ httpClient, apiUrls, koulutus });
};

export const submit = ({ koulutus, tila: tilaArg }) => async (
  dispatch,
  getState,
  { history, apiUrls, httpClient },
) => {
  const state = getState();
  const values = getKoulutusFormValues(state);
  const tila = tilaArg || koulutus.tila;
  const errors = validate({ values, tila, tyyppi: koulutus.metadata.tyyppi });

  dispatch(startSubmit('editKoulutusForm'));

  if (isNonEmptyObject(errors)) {
    dispatch(stopSubmit('editKoulutusForm', errors));
    dispatch(openSavingErrorToast());
    return;
  }

  const {
    me: { oid: kayttajaOid },
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

  const updatedKoulutus = produce(
    {
      ...koulutus,
      muokkaaja: kayttajaOid,
      tila,
      ...koulutusFormData,
      nimi,
    },
    draft => {
      draft.metadata.tyyppi = koulutus.metadata.tyyppi;
    },
  );

  let koulutusData;

  try {
    const { data } = await dispatch(saveKoulutus(updatedKoulutus));

    koulutusData = data;
  } catch (e) {
    dispatch(stopSubmit('editKoulutusForm'));
    dispatch(openSavingErrorToast());
    return;
  }

  dispatch(stopSubmit('editKoulutusForm'));
  dispatch(openSavingSuccessToast());

  history.push(`/koulutus/${koulutus.oid}/muokkaus`, {
    koulutusUpdatedAt: Date.now(),
  });

  return koulutusData;
};

export const attachToteutus = ({ organisaatioOid, koulutusOid }) => async (
  dispatch,
  getState,
  { history },
) => {
  history.push(
    `/organisaatio/${organisaatioOid}/koulutus/${koulutusOid}/toteutus`,
  );
};
