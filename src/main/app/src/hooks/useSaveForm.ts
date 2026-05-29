import { useCallback, useEffect } from 'react';

import { AxiosResponse } from 'axios';
import _ from 'lodash';
import { batch } from 'react-redux';
import {
  startSubmit as startSubmitAction,
  stopSubmit as stopSubmitAction,
  initialize,
} from 'redux-form';

import { ENTITY } from '#/src/constants';
import { useAuthorizedUser } from '#/src/contexts/AuthorizedUserContext';
import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useForm, useSubmitErrors } from '#/src/hooks/form';
import { useFormSaveRemoteErrors } from '#/src/hooks/useFormSaveRemoteErrors';
import useToaster from '#/src/hooks/useToaster';
import { HttpClient } from '#/src/httpClient';
import { ApiUrls } from '#/src/urls';
import { withRemoteErrors } from '#/src/utils/form/withRemoteErrors';

import { useDispatch } from './reduxHooks';

type SaveFormOptions = {
  formName: string;
  validate: (
    values: any,
    registeredFields: Record<string, { name: string }>
  ) => Promise<Record<string, unknown>> | Record<string, unknown>;
  submit: (args: {
    values: any;
    httpClient: HttpClient;
    apiUrls: ApiUrls;
  }) => Promise<{ warnings?: Array<string> } | void>;
};

type StopSubmitArgs = {
  errors: Record<string, any> | null;
  warnings?: Array<string>;
  response?: AxiosResponse;
};

export const useSaveForm = ({
  formName,
  validate,
  submit,
}: SaveFormOptions) => {
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
    ({ errors, warnings, response }: StopSubmitArgs) => {
      batch(() => {
        dispatch(stopSubmitAction(formName, errors ?? undefined));
        if (errors) {
          openSavingErrorToast(response?.data);
          setRemoteErrors(response?.data);
        } else if (warnings) {
          warnings.forEach(w => {
            openWarningToast(w);
          });
        } else {
          openSavingSuccessToast();
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

    let errors: Record<string, unknown> = {};

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
      const axiosError = e as { response?: AxiosResponse };
      errors = withRemoteErrors(
        formName as ENTITY,
        axiosError.response,
        errors,
        currentValues
      );
      stopSubmit({ errors, response: axiosError.response });
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
