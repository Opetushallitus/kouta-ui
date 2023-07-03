import { useCallback, useEffect } from 'react';

import _ from 'lodash';
import { useDispatch, batch } from 'react-redux';
import {
  startSubmit as startSubmitAction,
  stopSubmit as stopSubmitAction,
  initialize,
} from 'redux-form';

import { useAuthorizedUser } from '#/src/contexts/AuthorizedUserContext';
import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useForm, useSubmitErrors } from '#/src/hooks/form';
import { useFormSaveRemoteErrors } from '#/src/hooks/useFormSaveRemoteErrors';
import useToaster from '#/src/hooks/useToaster';
import { withRemoteErrors } from '#/src/utils/form/withRemoteErrors';

export const useSaveForm = ({ formName, validate, submit }) => {
  const dispatch = useDispatch();
  const user = useAuthorizedUser();
  const httpClient = useHttpClient();
  const apiUrls = useUrls();
  const { openSavingSuccessToast, openSavingErrorToast, openWarningToast } =
    useToaster();
  const { setRemoteErrors } = useFormSaveRemoteErrors();
  const form = useForm(formName);

  const submitErrors = useSubmitErrors();
  // Resetoidaan remote-errorit, ettei tallennusvirhe-modaali jää kummittelemaan
  useEffect(() => {
    if (_.isEmpty(submitErrors)) {
      setRemoteErrors(null);
    }
  }, [submitErrors, setRemoteErrors]);

  const startSubmit = useCallback(
    () => dispatch(startSubmitAction(formName)),
    [formName, dispatch]
  );

  const stopSubmit = useCallback(
    ({ errors, warnings, response }) => {
      batch(() => {
        dispatch(stopSubmitAction(formName, errors));
        if (errors) {
          openSavingErrorToast(response?.data);
          setRemoteErrors(response?.data);
        } else {
          if (warnings) {
            warnings.forEach(w => {
              openWarningToast(w);
            });
          } else {
            openSavingSuccessToast();
          }
        }
      });
    },
    [
      formName,
      dispatch,
      openSavingSuccessToast,
      openSavingErrorToast,
      openWarningToast,
      setRemoteErrors,
    ]
  );

  return useCallback(async () => {
    const muokkaaja = user?.oidHenkilo;
    const currentValues = form?.values ?? {};
    const enhancedValues = { muokkaaja, ...currentValues };

    startSubmit();

    let errors = {};

    try {
      errors = await validate(enhancedValues, form.registeredFields);
      if (_.isEmpty(errors)) {
        await submit({
          values: enhancedValues,
          httpClient,
          apiUrls,
        }).then(r => {
          stopSubmit({ errors: null, warnings: r?.warnings });
          // NOTE: initialize values with the saved ones to update the dirty state
          // This shouldn't be needed, because page data is refetched after save
          // (in Edit*Page components) and initial values are recalculated when data changes.
          dispatch(initialize(formName, currentValues));
        });
      } else {
        console.error(errors);
        stopSubmit({ errors });
      }
    } catch (e) {
      console.error(e);
      errors = withRemoteErrors(formName, e?.response, errors, currentValues);

      stopSubmit({ errors, response: e?.response });
    }
  }, [
    form,
    formName,
    dispatch,
    user,
    startSubmit,
    validate,
    submit,
    httpClient,
    apiUrls,
    stopSubmit,
  ]);
};
