import { getFormValues, startSubmit, stopSubmit } from 'redux-form';
import get from 'lodash/get';
import pick from 'lodash/pick';

import { isNonEmptyObject } from '../utils';
import { createSavingErrorToast, createSavingSuccessToast } from './toaster';
import { HAKULOMAKE_TYYPIT } from '../constants';

const identity = arg => arg;

export const submitAction = ({
  formName,
  validate,
  createSaveAction,
  getValidationArguments = identity,
}) => async (dispatch, getState) => {
  const state = getState();
  const values = getFormValues(formName)(state);
  const errors = validate(getValidationArguments({ values }));

  dispatch(startSubmit(formName));

  if (!isNonEmptyObject(errors)) {
    dispatch(stopSubmit(formName, errors));
    dispatch(createSavingErrorToast());
    return;
  }

  const saveAction = await createSaveAction({ values });

  try {
    const data = await dispatch(saveAction);
    dispatch(stopSubmit(formName));
    dispatch(createSavingSuccessToast());

    return data;
  } catch (e) {
    dispatch(stopSubmit(formName));
    dispatch(createSavingErrorToast());

    throw e;
  }
};

export const getHakulomakeFieldsData = ({
  values,
  kielivalinta,
  name = 'hakulomake',
}) => {
  const hakulomaketyyppi = get(values, [name, 'tyyppi']) || null;

  const hakulomakeId = [HAKULOMAKE_TYYPIT.ATARU].includes(hakulomaketyyppi)
    ? get(values, [name, 'lomake', hakulomaketyyppi, 'value']) || null
    : null;

  const hakulomakeLinkki =
    hakulomaketyyppi === HAKULOMAKE_TYYPIT.MUU
      ? pick(get(values, [name, 'linkki']) || {}, kielivalinta)
      : {};

  const hakulomakeKuvaus =
    hakulomaketyyppi === HAKULOMAKE_TYYPIT.EI_SAHKOISTA_HAKUA
      ? pick(get(values, [name, 'kuvaus']) || {}, kielivalinta)
      : {};

  return {
    hakulomaketyyppi,
    hakulomakeId,
    hakulomakeLinkki,
    hakulomakeKuvaus,
  };
};
