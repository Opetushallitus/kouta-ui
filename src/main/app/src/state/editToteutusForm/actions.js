import { getFormValues, startSubmit, stopSubmit } from 'redux-form';
import get from 'lodash/get';
import produce from 'immer';

import { getToteutusByValues, validate } from '../createToteutusForm';
import { updateKoutaToteutus } from '../../apiUtils';
import { createSavingErrorToast, createSavingSuccessToast } from '../toaster';
import { isNonEmptyObject } from '../../utils';

const formName = 'editToteutusForm';
const getToteutusFormValues = getFormValues(formName);

export const saveToteutus = toteutus => (
  dispatch,
  getState,
  { apiUrls, httpClient },
) => {
  return updateKoutaToteutus({ httpClient, apiUrls, toteutus });
};

export const submit = ({ toteutus, tila: tilaArg }) => async (
  dispatch,
  getState,
  { history },
) => {
  const state = getState();
  const values = getToteutusFormValues(state);
  const tila = tilaArg || toteutus.tila;
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

  const toteutusFormData = getToteutusByValues(values);

  const updatedToteutus = produce(
    {
      ...toteutus,
      muokkaaja: kayttajaOid,
      tila,
      ...toteutusFormData,
    },
    draft => {
      draft.metadata.tyyppi = toteutus.metadata.tyyppi;
    },
  );

  let toteutusData;

  try {
    const { data } = await dispatch(saveToteutus(updatedToteutus));

    toteutusData = data;
  } catch (e) {
    dispatch(stopSubmit(formName));
    dispatch(createSavingErrorToast());
    return;
  }

  dispatch(stopSubmit(formName));
  dispatch(createSavingSuccessToast());

  history.push(`/toteutus/${toteutus.oid}/muokkaus`, {
    toteutusUpdatedAt: Date.now(),
  });

  return toteutusData;
};

export const attachHakukohde = ({ organisaatioOid, toteutusOid }) => async (
  dispatch,
  getState,
  { history },
) => {
  const values = getToteutusFormValues(getState());

  const hakuOid = get(values, 'hakukohteet.haku.value');

  if (hakuOid) {
    history.push(
      `/organisaatio/${organisaatioOid}/toteutus/${toteutusOid}/haku/${hakuOid}/hakukohde`,
    );
  }
};
