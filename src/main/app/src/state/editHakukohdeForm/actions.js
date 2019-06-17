import { getFormValues, startSubmit, stopSubmit } from 'redux-form';
import produce from 'immer';

import getHakukohdeByFormValues from '../../utils/getHakukohdeByFormValues';
import validateHakukohdeForm from '../../utils/validateHakukohdeForm';
import { updateKoutaHakukohde } from '../../apiUtils';
import { openSavingErrorToast, openSavingSuccessToast } from '../toaster';
import { isNonEmptyObject } from '../../utils';

const formName = 'editHakukohdeForm';
const getHakukohdeFormValues = getFormValues(formName);

export const saveHakukohde = hakukohde => (
  dispatch,
  getState,
  { apiUrls, httpClient },
) => {
  return updateKoutaHakukohde({ httpClient, apiUrls, hakukohde });
};

export const submit = ({ hakukohde, tila: tilaArg }) => async (
  dispatch,
  getState,
  { history },
) => {
  const state = getState();
  const values = getHakukohdeFormValues(state);
  const tila = tilaArg || hakukohde.tila;
  const errors = validateHakukohdeForm({ values, tila });

  dispatch(startSubmit(formName));

  if (isNonEmptyObject(errors)) {
    dispatch(stopSubmit(formName, errors));
    dispatch(openSavingErrorToast());
    return;
  }

  const {
    me: { oid: kayttajaOid },
  } = state;

  const hakukohdeFormData = getHakukohdeByFormValues(values);

  const updatedHakukohde = produce(
    {
      ...hakukohde,
      muokkaaja: kayttajaOid,
      tila,
      ...hakukohdeFormData,
    },
    () => {},
  );

  let hakukohdeData;

  try {
    const { data } = await dispatch(saveHakukohde(updatedHakukohde));

    hakukohdeData = data;
  } catch (e) {
    dispatch(stopSubmit(formName));
    dispatch(openSavingErrorToast());
    return;
  }

  dispatch(stopSubmit(formName));
  dispatch(openSavingSuccessToast());

  history.push(`/hakukohde/${hakukohde.oid}/muokkaus`, {
    hakukohdeUpdatedAt: Date.now(),
  });

  return hakukohdeData;
};
