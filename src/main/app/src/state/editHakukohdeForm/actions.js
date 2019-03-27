import { getFormValues } from 'redux-form';
import produce from 'immer';

import { getHakukohdeByValues } from '../createHakukohdeForm';
import { updateKoutaHakukohde } from '../../apiUtils';
import { createTemporaryToast } from '../toaster';

const getHakukohdeFormValues = getFormValues('editHakukohdeForm');

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
  { history, apiUrls, httpClient },
) => {
  const state = getState();
  const values = getHakukohdeFormValues(state);
  const tila = tilaArg || hakukohde.tila;

  const {
    me: { kayttajaOid },
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
    return dispatch(
      createTemporaryToast({
        status: 'danger',
        title: 'Hakukohteen tallennus epäonnistui',
      }),
    );
  }

  dispatch(
    createTemporaryToast({
      status: 'success',
      title: 'Hakukohde on tallennettu onnistuneesti',
    }),
  );

  history.push(`/hakukohde/${hakukohde.oid}/muokkaus`, {
    hakukohdeUpdatedAt: Date.now(),
  });

  return hakukohdeData;
};
