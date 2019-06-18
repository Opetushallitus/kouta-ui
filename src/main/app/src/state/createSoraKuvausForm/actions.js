import { getFormValues, startSubmit, stopSubmit } from 'redux-form';
import get from 'lodash/get';

import { JULKAISUTILA, POHJAVALINTA } from '../../constants';
import { openSavingErrorToast, openSavingSuccessToast } from '../toaster';
import { getSoraKuvausByValues, validate } from './utils';
import { isNonEmptyObject } from '../../utils';
import createSoraKuvaus from '../../utils/kouta/createSoraKuvaus';

const formName = 'createSoraKuvausForm';
const getSoraKuvausFormValues = getFormValues(formName);

const getOidsFromPathname = pathname => {
  const split = pathname.split('/').filter(p => !!p);

  return {
    organisaatioOid: split[1],
  };
};

export const saveSoraKuvaus = soraKuvaus => (
  dispatch,
  getState,
  { apiUrls, httpClient },
) => {
  return createSoraKuvaus({ httpClient, apiUrls, soraKuvaus });
};

export const maybeCopy = () => (dispatch, getState) => {
  const values = getSoraKuvausFormValues(getState());

  if (
    get(values, 'pohja.tapa') === POHJAVALINTA.KOPIO &&
    !!get(values, 'pohja.valinta.value')
  ) {
    dispatch(copy(values.pohja.valinta.value));
  }
};

export const copy = soraKuvausId => (dispatch, getState, { history }) => {
  history.replace({
    search: `?kopioSoraKuvausId=${soraKuvausId}`,
  });
};

export const submit = ({ tila = JULKAISUTILA.TALLENNETTU } = {}) => async (
  dispatch,
  getState,
  { history },
) => {
  const state = getState();
  const values = getSoraKuvausFormValues(state);
  const errors = validate({ values, tila });

  dispatch(startSubmit(formName));

  if (isNonEmptyObject(errors)) {
    dispatch(stopSubmit(formName, errors));
    dispatch(openSavingErrorToast());
    return;
  }

  const {
    me: { oid: muokkaaja },
  } = state;

  const { organisaatioOid } = getOidsFromPathname(history.location.pathname);

  const soraKuvausFormData = getSoraKuvausByValues(values);

  const haku = {
    organisaatioOid,
    muokkaaja,
    tila,
    ...soraKuvausFormData,
  };

  let soraKuvausData;

  try {
    soraKuvausData = await dispatch(saveSoraKuvaus(haku));
  } catch (e) {
    dispatch(stopSubmit(formName));
    dispatch(openSavingErrorToast());
    return;
  }

  dispatch(stopSubmit(formName));
  dispatch(openSavingSuccessToast());

  if (get(soraKuvausData, 'id')) {
    history.push(`/sora-kuvaus/${soraKuvausData.id}/muokkaus`);
  } else {
    history.push('/');
  }
};
