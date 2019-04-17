import { getFormValues, startSubmit, stopSubmit } from 'redux-form';

import { isNonEmptyObject } from '../utils';
import { createSavingErrorToast, createSavingSuccessToast } from './toaster';

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
