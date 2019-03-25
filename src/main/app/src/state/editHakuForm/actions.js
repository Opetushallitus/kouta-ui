import { getFormValues } from 'redux-form';
import get from 'lodash/get';

import { getHakuByValues } from '../createHakuForm/utils';
import { updateKoutaHaku } from '../../apiUtils';
import { createTemporaryToast } from '../toaster';

const getHakuFormValues = getFormValues('editHakuForm');

export const saveHaku = haku => (
  dispatch,
  getState,
  { apiUrls, httpClient },
) => {
  return updateKoutaHaku({ httpClient, apiUrls, haku });
};

export const submit = ({
  hakuOid,
  organisaatioOid,
  tila,
  lastModified,
}) => async (dispatch, getState, { history, apiUrls, httpClient }) => {
  const state = getState();
  const values = getHakuFormValues(state);

  const {
    me: { kayttajaOid },
  } = state;

  const hakuFormData = getHakuByValues(values);

  const haku = {
    lastModified,
    oid: hakuOid,
    muokkaaja: kayttajaOid,
    ...(tila && { tila }),
    ...(organisaatioOid && { organisaatioOid }),
    ...hakuFormData,
  };

  let hakuData;

  try {
    const { data } = await dispatch(saveHaku(haku));

    hakuData = data;
  } catch (e) {
    return dispatch(
      createTemporaryToast({
        status: 'danger',
        title: 'Haun tallennus epäonnistui',
      }),
    );
  }

  dispatch(
    createTemporaryToast({
      status: 'success',
      title: 'Haku on tallennettu onnistuneesti',
    }),
  );

  history.push(`/haku/${hakuOid}/muokkaus`, {
    hakuUpdatedAt: Date.now(),
  });

  return hakuData;
};

export const attachHakukohde = ({ organisaatioOid, hakuOid }) => async (
  dispatch,
  getState,
  { history },
) => {
  const values = getHakuFormValues(getState());

  const toteutusOid = get(values, 'toteutus.value');

  history.push(
    `/organisaatio/${organisaatioOid}/toteutus/${toteutusOid}/haku/${hakuOid}/hakukohde`,
  );
};
