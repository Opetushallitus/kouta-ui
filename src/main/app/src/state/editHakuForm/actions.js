import { getFormValues, stopSubmit, startSubmit } from 'redux-form';
import get from 'lodash/get';

import { getHakuByValues, validate } from '../createHakuForm/utils';
import { updateKoutaHaku } from '../../apiUtils';
import { createSavingErrorToast, createSavingSuccessToast } from '../toaster';
import { isNonEmptyObject } from '../../utils';

const formName = 'editHakuForm';
const getHakuFormValues = getFormValues(formName);

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
}) => async (dispatch, getState, { history }) => {
  const state = getState();
  const values = getHakuFormValues(state);
  const errors = validate({ values, tila });

  dispatch(startSubmit(formName));

  if (isNonEmptyObject(errors)) {
    dispatch(stopSubmit(formName, errors));
    dispatch(createSavingErrorToast());
    return;
  }

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
    dispatch(stopSubmit(formName));
    dispatch(createSavingErrorToast());
    return;
  }

  dispatch(stopSubmit(formName));
  dispatch(createSavingSuccessToast());

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
