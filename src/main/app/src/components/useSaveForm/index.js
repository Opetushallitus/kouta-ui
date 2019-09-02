import { useCallback, useContext } from 'react';
import { useDispatch, batch, useStore } from 'react-redux';

import {
  startSubmit as startSubmitAction,
  stopSubmit as stopSubmitAction,
} from 'redux-form';

import get from 'lodash/get';

import useAuthorizedUser from '../useAuthorizedUser';
import HttpContext from '../HttpContext';
import UrlContext from '../UrlContext';
import isEmpty from '../../utils/isEmpty';

import {
  openSavingErrorToast,
  openSavingSuccessToast,
} from '../../state/toaster';

const useSaveForm = ({ form, validate, submit }) => {
  const dispatch = useDispatch();
  const user = useAuthorizedUser();
  const httpClient = useContext(HttpContext);
  const apiUrls = useContext(UrlContext);
  const store = useStore();

  const startSubmit = useCallback(() => {
    return dispatch(startSubmitAction(form));
  }, [form, dispatch]);

  const stopSubmit = useCallback(
    ({ errors, errorToast, successToast }) => {
      batch(() => {
        dispatch(stopSubmitAction(form, errors));

        if (errorToast) {
          dispatch(openSavingErrorToast());
        } else if (successToast) {
          dispatch(openSavingSuccessToast());
        }
      });
    },
    [form, dispatch],
  );

  const save = useCallback(async () => {
    const values = get(store.getState(), ['form', form, 'values']) || {};
    const muokkaaja = get(user, 'oid');
    const enhancedValues = { muokkaaja, ...values };

    startSubmit();

    const errors = await validate(enhancedValues);

    if (!isEmpty(errors)) {
      stopSubmit({ errors, errorToast: true });
      return;
    }

    try {
      await submit({ values: enhancedValues, httpClient, apiUrls });
    } catch (e) {
      stopSubmit({ errorToast: true });
      return;
    }

    stopSubmit({ successToast: true });
  }, [
    user,
    submit,
    startSubmit,
    stopSubmit,
    validate,
    httpClient,
    apiUrls,
    store,
    form,
  ]);

  return {
    save,
  };
};

export default useSaveForm;
