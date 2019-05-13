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
  const lomakeValues = get(values, name);
  const hakulomaketyyppi = get(lomakeValues, 'tyyppi') || null;

  const hakulomakeId = [HAKULOMAKE_TYYPIT.ATARU].includes(hakulomaketyyppi)
    ? get(lomakeValues, ['lomake', hakulomaketyyppi, 'value']) || null
    : null;

  const hakulomakeLinkki =
    hakulomaketyyppi === HAKULOMAKE_TYYPIT.MUU
      ? pick(get(lomakeValues, 'linkki') || {}, kielivalinta)
      : {};

  const hakulomakeKuvaus =
    hakulomaketyyppi === HAKULOMAKE_TYYPIT.EI_SAHKOISTA_HAKUA
      ? pick(get(lomakeValues, 'kuvaus') || {}, kielivalinta)
      : {};

  return {
    hakulomaketyyppi,
    hakulomakeId,
    hakulomakeLinkki,
    hakulomakeKuvaus,
  };
};

export const getHakulomakeFieldsValues = ({
  hakulomaketyyppi,
  hakulomakeId,
  hakulomakeLinkki,
  hakulomakeKuvaus,
}) => {
  return {
    tyyppi: hakulomaketyyppi,
    lomake: [HAKULOMAKE_TYYPIT.ATARU].includes(hakulomaketyyppi)
      ? {
          [hakulomaketyyppi]: { value: hakulomakeId || '' },
        }
      : {},
    linkki: hakulomakeLinkki || {},
    kuvaus: hakulomakeKuvaus || {},
  };
};
