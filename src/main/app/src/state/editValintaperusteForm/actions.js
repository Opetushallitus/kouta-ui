import { getFormValues } from 'redux-form';

import { getValintaperusteByValues } from '../createValintaperusteForm';
import { updateKoutaValintaperuste } from '../../apiUtils';
import { createTemporaryToast } from '../toaster';

const getValintaperusteFormValues = getFormValues('editValintaperusteForm');

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

  const {
    me: { kayttajaOid },
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
    return dispatch(
      createTemporaryToast({
        status: 'danger',
        title: 'Valintaperusteen tallennus epäonnistui',
      }),
    );
  }

  dispatch(
    createTemporaryToast({
      status: 'success',
      title: 'Valintaperuste on tallennettu onnistuneesti',
    }),
  );

  history.push(`/valintaperusteet/${valintaperuste.id}/muokkaus`, {
    valintaperusteUpdatedAt: Date.now(),
  });

  return valintaperusteData;
};
