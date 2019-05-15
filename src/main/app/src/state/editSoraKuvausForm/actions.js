import { getFormValues, startSubmit, stopSubmit } from 'redux-form';

import { getSoraKuvausByValues, validate } from '../createSoraKuvausForm';
import { updateKoutaSoraKuvaus } from '../../apiUtils';
import { createSavingErrorToast, createSavingSuccessToast } from '../toaster';
import { isNonEmptyObject } from '../../utils';

const formName = 'editSoraKuvausForm';
const getSoraKuvausFormValues = getFormValues(formName);

export const saveSoraKuvaus = soraKuvaus => (
  dispatch,
  getState,
  { apiUrls, httpClient },
) => {
  return updateKoutaSoraKuvaus({ httpClient, apiUrls, soraKuvaus });
};

export const submit = ({ soraKuvaus, tila: tilaArg }) => async (
  dispatch,
  getState,
  { history },
) => {
  const state = getState();
  const values = getSoraKuvausFormValues(state);
  const tila = tilaArg || soraKuvaus.tila;
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

  const soraKuvausFormData = getSoraKuvausByValues(values);

  const updatedSoraKuvaus = {
    ...soraKuvaus,
    muokkaaja: kayttajaOid,
    tila,
    ...soraKuvausFormData,
  };

  let soraKuvausData;

  try {
    const { data } = await dispatch(saveSoraKuvaus(updatedSoraKuvaus));

    soraKuvausData = data;
  } catch (e) {
    dispatch(stopSubmit(formName));
    dispatch(createSavingErrorToast());
    return;
  }

  dispatch(stopSubmit(formName));
  dispatch(createSavingSuccessToast());

  history.push(`/sora-kuvaus/${soraKuvaus.id}/muokkaus`, {
    soraKuvausUpdatedAt: Date.now(),
  });

  return soraKuvausData;
};
