import { getFormValues, startSubmit, stopSubmit } from 'redux-form';

import { getSoraKuvausByValues, validate } from '../createSoraKuvausForm';
import updateSoraKuvaus from '../../utils/kouta/updateSoraKuvaus';
import { openSavingErrorToast, openSavingSuccessToast } from '../toaster';
import { isNonEmptyObject } from '../../utils';

const formName = 'editSoraKuvausForm';
const getSoraKuvausFormValues = getFormValues(formName);

export const saveSoraKuvaus = soraKuvaus => (
  dispatch,
  getState,
  { apiUrls, httpClient },
) => {
  return updateSoraKuvaus({ httpClient, apiUrls, soraKuvaus });
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
    dispatch(openSavingErrorToast());
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
    dispatch(openSavingErrorToast());
    return;
  }

  dispatch(stopSubmit(formName));
  dispatch(openSavingSuccessToast());

  history.push(`/sora-kuvaus/${soraKuvaus.id}/muokkaus`, {
    soraKuvausUpdatedAt: Date.now(),
  });

  return soraKuvausData;
};
