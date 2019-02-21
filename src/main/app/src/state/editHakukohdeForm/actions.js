import { getFormValues } from 'redux-form';

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

export const submit = ({
  hakukohdeOid,
  organisaatioOid,
  tila,
  lastModified,
  hakuOid,
  toteutusOid,
}) => async (dispatch, getState, { history, apiUrls, httpClient }) => {
  const state = getState();
  const values = getHakukohdeFormValues(state);

  const {
    me: { kayttajaOid },
  } = state;

  const hakukohdeFormData = getHakukohdeByValues(values);

  const hakukohde = {
    lastModified,
    oid: hakukohdeOid,
    muokkaaja: kayttajaOid,
    ...(tila && { tila }),
    ...(organisaatioOid && { organisaatioOid }),
    ...(hakuOid && { hakuOid }),
    ...(toteutusOid && { toteutusOid }),
    ...hakukohdeFormData,
  };

  let hakukohdeData;

  try {
    const { data } = await dispatch(saveHakukohde(hakukohde));

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

  history.push(`/hakukohde/${hakukohdeOid}/muokkaus`, {
    hakukohdeUpdatedAt: Date.now(),
  });

  return hakukohdeData;
};
