import { getFormValues, startSubmit, stopSubmit } from 'redux-form';

import {
  getValintaperusteByValues,
  validate,
} from '../createValintaperusteForm';
import { updateKoutaValintaperuste } from '../../apiUtils';
import { createSavingErrorToast, createSavingSuccessToast } from '../toaster';
import { isNonEmptyObject } from '../../utils';

const formName = 'editValintaperusteForm';
const getValintaperusteFormValues = getFormValues(formName);

export const saveValintaperuste = valintaperuste => (
  dispatch,
  getState,
  { apiUrls, httpClient },
) => {
  return updateKoutaValintaperuste({ httpClient, apiUrls, valintaperuste });
};

export const submit = ({ valintaperuste, tila: tilaArg }) => async (
  dispatch,
  getState,
  { history },
) => {
  const state = getState();
  const values = getValintaperusteFormValues(state);
  const tila = tilaArg || valintaperuste.tila;
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

  const valintaperusteFormData = getValintaperusteByValues(values);

  const updatedValintaperuste = {
    ...valintaperuste,
    muokkaaja: kayttajaOid,
    tila,
    ...valintaperusteFormData,
  };

  let valintaperusteData;

  try {
    const { data } = await dispatch(saveValintaperuste(updatedValintaperuste));

    valintaperusteData = data;
  } catch (e) {
    dispatch(stopSubmit(formName, errors));
    dispatch(createSavingErrorToast());
    return;
  }

  dispatch(stopSubmit(formName));
  dispatch(createSavingSuccessToast());

  history.push(`/valintaperusteet/${valintaperuste.id}/muokkaus`, {
    valintaperusteUpdatedAt: Date.now(),
  });

  return valintaperusteData;
};
