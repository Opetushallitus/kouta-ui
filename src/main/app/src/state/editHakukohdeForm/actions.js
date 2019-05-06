import { getFormValues, startSubmit, stopSubmit } from 'redux-form';
import produce from 'immer';

import { getHakukohdeByValues, validate } from '../createHakukohdeForm';
import { updateKoutaHakukohde } from '../../apiUtils';
import { createSavingErrorToast, createSavingSuccessToast } from '../toaster';
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
  const errors = validate({ values, tila });

  dispatch(startSubmit(formName));

  if (isNonEmptyObject(errors)) {
    dispatch(stopSubmit(formName, errors));
    dispatch(createSavingErrorToast());
    return;
  }

  const {
    me: { oid: kayttajaOid },
  } = state;

  const hakukohdeFormData = getHakukohdeByValues(values);

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
    dispatch(createSavingErrorToast());
    return;
  }

  dispatch(stopSubmit(formName));
  dispatch(createSavingSuccessToast());

  history.push(`/hakukohde/${hakukohde.oid}/muokkaus`, {
    hakukohdeUpdatedAt: Date.now(),
  });

  return hakukohdeData;
};
