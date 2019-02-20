import { getFormValues } from 'redux-form';
import get from 'lodash/get';

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

export const submit = ({
  toteutusOid,
  organisaatioOid,
  tila,
  lastModified,
}) => async (dispatch, getState, { history, apiUrls, httpClient }) => {
  const state = getState();
  const values = getToteutusFormValues(state);

  const {
    me: { kayttajaOid },
  } = state;

  const toteutusFormData = getToteutusByValues(values);

  const toteutus = {
    lastModified,
    oid: toteutusOid,
    muokkaaja: kayttajaOid,
    ...(tila && { tila }),
    ...(organisaatioOid && { organisaatioOid }),
    ...toteutusFormData,
  };

  let toteutusData;

  try {
    const { data } = await dispatch(saveToteutus(toteutus));

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

  history.push(`/toteutus/${toteutusOid}/muokkaus`, {
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
