import { getFormValues } from 'redux-form';
import get from 'lodash/get';
import produce from 'immer';

import { getToteutusByValues } from '../createToteutusForm';
import { updateKoutaToteutus } from '../../apiUtils';
import { createTemporaryToast } from '../toaster';

const getToteutusFormValues = getFormValues('editToteutusForm');

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
  { history, apiUrls, httpClient },
) => {
  const state = getState();
  const values = getToteutusFormValues(state);
  const tila = tilaArg || toteutus.tila;

  const {
    me: { kayttajaOid },
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
    return dispatch(
      createTemporaryToast({
        status: 'danger',
        title: 'Toteutuksen tallennus epäonnistui',
      }),
    );
  }

  dispatch(
    createTemporaryToast({
      status: 'success',
      title: 'Toteutus on tallennettu onnistuneesti',
    }),
  );

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
