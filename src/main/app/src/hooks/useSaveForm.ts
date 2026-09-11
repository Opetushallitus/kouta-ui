import { useCallback, useEffect } from 'react';

import _ from 'lodash';

import { useFieldRegistry } from '#/src/components/formFields/FieldRegistry';
import { useAuthorizedUser } from '#/src/contexts/AuthorizedUserContext';
import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import {
  useRegisterSubmitHandler,
  useReinitialize,
  useSubmitErrors,
} from '#/src/hooks/form';
import { useFormSaveRemoteErrors } from '#/src/hooks/useFormSaveRemoteErrors';
import useToaster from '#/src/hooks/useToaster';
import { withRemoteErrors } from '#/src/utils/form/withRemoteErrors';

// Tämä on kirjaston onSubmit, ei footerista kutsuttava funktio: useRegisterSubmitHandler
// asettaa sen ReactFinalFormin refiin, josta <Form> kutsuu sitä.
//
// Erot redux-form-polkuun:
//   - submitting-tilaa ei aseteta itse, kirjasto hoitaa sen form.submit():ssa
//   - virheitä ei kirjata contextiin vaan PALAUTETAAN, jolloin kirjasto asettaa
//     ne submitErrorsiin ja kenttien meta.submitErroriin
//   - batch() reduxista ei enää tarvita, koska setStateja ei ole
export const useSaveForm = ({ formName, validate, submit }) => {
  const user = useAuthorizedUser();
  const httpClient = useHttpClient();
  const apiUrls = useUrls();
  const { openSavingSuccessToast, openSavingErrorToast, openWarningToast } =
    useToaster();
  const { setRemoteErrors } = useFormSaveRemoteErrors();
  const fieldRegistry = useFieldRegistry();
  const reinitialize = useReinitialize();

  const submitErrors = useSubmitErrors();
  // Resetoidaan remote-errorit, ettei tallennusvirhe-modaali jää kummittelemaan
  useEffect(() => {
    if (_.isEmpty(submitErrors)) {
      setRemoteErrors(null);
    }
  }, [submitErrors, setRemoteErrors]);

  const handler = useCallback(
    async (submittedValues: any) => {
      const muokkaaja = user?.oidHenkilo;
      const currentValues = submittedValues ?? {};
      const enhancedValues = { muokkaaja, ...currentValues };

      let errors = {};

      try {
        // Näkyvyyssääntö validoinnille tulee kenttärekisteristä, joka on sen ainoa
        // lähde. Ks. FieldRegistry - kirjaston getRegisteredFields ei kelpaisi, koska
        // useField rekisteröi kentän myös pelkästä lukemisesta.
        errors = await validate(
          enhancedValues,
          fieldRegistry?.getRegisteredFields() ?? undefined
        );

        if (_.isEmpty(errors)) {
          const r = await submit({
            values: enhancedValues,
            httpClient,
            apiUrls,
          });

          if (r?.warnings) {
            r.warnings.forEach(w => openWarningToast(w));
          } else {
            openSavingSuccessToast();
          }

          // NOTE: initialize values with the saved ones to update the dirty state
          // This shouldn't be needed, because page data is refetched after save
          // (in Edit*Page components) and initial values are recalculated when data changes.
          reinitialize(currentValues);
          fieldRegistry?.clearUnregisteredFields();
          return undefined;
        }

        console.error(errors);
        // Sama toast kuin redux-form-polulla, jossa stopSubmit näytti sen aina kun
        // virheitä oli - myös pelkän validointivirheen kohdalla.
        openSavingErrorToast(undefined);
        setRemoteErrors(undefined);
        // PALAUTETAAN, ei kirjata contextiin: kirjasto vie nämä submitErrorsiin ja
        // kenttien meta.submitErroriin.
        return errors;
      } catch (e: any) {
        console.error(e);
        errors = withRemoteErrors(formName, e?.response, errors, currentValues);
        openSavingErrorToast(e?.response?.data);
        setRemoteErrors(e?.response?.data);
        return errors;
      }
    },
    [
      apiUrls,
      fieldRegistry,
      formName,
      httpClient,
      openSavingErrorToast,
      openSavingSuccessToast,
      openWarningToast,
      reinitialize,
      setRemoteErrors,
      submit,
      user,
      validate,
    ]
  );

  useRegisterSubmitHandler(handler);
};
