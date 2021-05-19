import { useCallback } from 'react';

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
import { useForm } from '#/src/hooks/form';
import useToaster from '#/src/hooks/useToaster';
import { withRemoteErrors } from '#/src/utils/form/withRemoteErrors';
import getHakuByOid from '#/src/utils/haku/getHakuByOid';
import validateHakukohdeForm from '#/src/utils/hakukohde/validateHakukohdeForm';
import getToteutusByOid from '#/src/utils/toteutus/getToteutusByOid';
import { getValintaperusteById } from '#/src/utils/valintaperuste/getValintaperusteById';

export const useSaveForm = ({ formName, validate, submit }) => {
  const dispatch = useDispatch();
  const user = useAuthorizedUser();
  const httpClient = useHttpClient();
  const apiUrls = useUrls();
  const { openSavingSuccessToast, openSavingErrorToast } = useToaster();
  const form = useForm(formName);

  const startSubmit = useCallback(() => {
    return dispatch(startSubmitAction(formName));
  }, [formName, dispatch]);

  const stopSubmit = useCallback(
    ({ errors, errorToast, successToast }) => {
      batch(() => {
        dispatch(stopSubmitAction(formName, errors));

        if (errorToast) {
          errors && openSavingErrorToast();
        } else if (successToast) {
          openSavingSuccessToast();
        }
      });
    },
    [formName, dispatch, openSavingSuccessToast, openSavingErrorToast]
  );

  const save = useCallback(async () => {
    const muokkaaja = user?.oid;
    const currentValues = form?.values ?? {};
    const enhancedValues = { muokkaaja, ...currentValues };

    startSubmit();

    let errors = {};

    try {
      errors = await validate(enhancedValues, form.registeredFields);
      if (_.isEmpty(errors)) {
        await submit({ values: enhancedValues, httpClient, apiUrls }).then(
          () => {
            stopSubmit({ successToast: true });
            // NOTE: initialize values with the saved ones to update the dirty state
            // This shouldn't be needed, because page data is refetched after save
            // (in Edit*Page components) and initial values are recalculated when data changes.
            dispatch(initialize(formName, currentValues));
          }
        );
      } else {
        console.error(errors);
        stopSubmit({ errors, errorToast: true });
      }
    } catch (e) {
      console.error(e);
      errors = withRemoteErrors(formName, e?.response, errors);

      stopSubmit({ errors, errorToast: true });
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

  return save;
};

export const useSaveHakukohde = ({
  formName,
  submit,
  haku: oldHaku,
  toteutus: oldToteutus,
}) => {
  const httpClient = useHttpClient();
  const apiUrls = useUrls();

  return useSaveForm({
    formName,
    submit,
    validate: async values => {
      const valintaperusteId = _.get(values, 'valintaperusteenKuvaus.value');
      const [toteutus, haku, valintaperuste] = await Promise.all([
        getToteutusByOid({ httpClient, apiUrls, oid: oldToteutus.oid }),
        getHakuByOid({ httpClient, apiUrls, oid: oldHaku.oid }),
        valintaperusteId
          ? getValintaperusteById({
              httpClient,
              apiUrls,
              oid: valintaperusteId,
            })
          : Promise.resolve(),
      ]);
      return validateHakukohdeForm({
        ...values,
        haku,
        toteutus,
        valintaperuste,
      });
    },
  });
};
