import { useCallback, useEffect } from 'react';

import _ from 'lodash';
import { batch } from 'react-redux';

import { useFieldRegistry } from '#/src/components/formFields/FieldRegistry';
import { useAuthorizedUser } from '#/src/contexts/AuthorizedUserContext';
import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useForm, useSubmitErrors } from '#/src/hooks/form';
import { useFormAdapter } from '#/src/hooks/formAdapter';
import { useFormSaveRemoteErrors } from '#/src/hooks/useFormSaveRemoteErrors';
import useToaster from '#/src/hooks/useToaster';
import { withRemoteErrors } from '#/src/utils/form/withRemoteErrors';

export const useSaveForm = ({ formName, validate, submit }) => {
  const user = useAuthorizedUser();
  const httpClient = useHttpClient();
  const apiUrls = useUrls();
  const { openSavingSuccessToast, openSavingErrorToast, openWarningToast } =
    useToaster();
  const { setRemoteErrors } = useFormSaveRemoteErrors();
  const form = useForm(formName);
  const fieldRegistry = useFieldRegistry();
  const submitLifecycle = useFormAdapter().useSubmitLifecycle();

  const submitErrors = useSubmitErrors();
  // Resetoidaan remote-errorit, ettei tallennusvirhe-modaali jää kummittelemaan
  useEffect(() => {
    if (_.isEmpty(submitErrors)) {
      setRemoteErrors(null);
    }
  }, [submitErrors, setRemoteErrors]);

  const startSubmit = useCallback(
    () => submitLifecycle.startSubmit(),
    [submitLifecycle]
  );

  const stopSubmit = useCallback(
    ({ errors, warnings, response }) => {
      batch(() => {
        submitLifecycle.stopSubmit(errors);
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
      submitLifecycle,
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
      // Näkyvyyssääntö validoinnille tulee kenttärekisteristä. Se on ainoa lähde:
      // aiemmin tässä oli lippu ja varjovertailu redux-formin rekisteriin, mutta
      // redux-formia ei enää ole eikä vertailukohtaa siten myöskään.
      //
      // Rekisteri seuraa RENDERÖITYJÄ kenttiä. Kirjaston oma getRegisteredFields ei
      // kelpaisi: react-final-formissa useField rekisteröi kentän jo pelkästä
      // lukemisesta, joten sovittimen useValue-kutsut kasvattaisivat joukkoa
      // kentillä, joita ei renderöity. Näkyvyyssääntö tarkoittaa nimenomaan
      // renderöityjä.
      errors = await validate(
        enhancedValues,
        fieldRegistry?.getRegisteredFields() ?? {}
      );

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
          submitLifecycle.reinitialize(currentValues);
          // INITIALIZE tyhjentää vanhan unregisteredFieldsin (rootReducer.ts:37-39).
          // Uusi rekisteri ei näe actionia, joten sama tehdään sille suoraan. Samalla
          // siirtyy vertailukohta, jota vasten seuraavia initialValues-propseja verrataan.
          //
          // HUOM: tämä on käytännössä ylimääräinen varmistus. afterUpdate invalidoi
          // kyselyn heti tämän jälkeen, QueryResultWrapper menee isFetching-tilaan ja
          // purkaa koko lomakkeen, jolloin provider tuhoutuu ja rekisteri syntyy
          // tyhjänä joka tapauksessa. Mitattu: B7-testi ei punaa, vaikka tämän rivin
          // poistaa. Rivi jää siltä varalta, että tallennus joskus tapahtuu ilman
          // sitä seuraavaa uudelleenhakua - ja koska kirjastonvaihdon jälkeen
          // lomakkeen purkautumiskäyttäytyminen voi olla toinen, jolloin tämä muuttuu
          // ylimääräisestä välttämättömäksi.
          fieldRegistry?.reset(currentValues);
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
    fieldRegistry,
    submitLifecycle,
    user,
    startSubmit,
    validate,
    submit,
    httpClient,
    apiUrls,
    stopSubmit,
  ]);
};
