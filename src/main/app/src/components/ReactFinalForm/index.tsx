import React, { useCallback, useMemo, useRef } from 'react';

import arrayMutators from 'final-form-arrays';
import _ from 'lodash';
import { Form } from 'react-final-form';

import { FieldRegistryProvider } from '#/src/components/formFields/FieldRegistry';
import FormContext from '#/src/contexts/FormContext';
import {
  SubmitHandlerContext,
  SubmitHandler,
} from '#/src/contexts/SubmitHandlerContext';

// Lomakkeen juuri: renderöi <Form>, ja tarjoaa alipuulleen FormContextin,
// kenttärekisterin ja tallennuskäsittelijän refin.
//
// Tallennus kulkee kirjaston submit-elinkaaren läpi: onSubmit on aito ja footerin
// Tallenna kutsuu form.submit():a.
//
// Vaihtoehto olisi kutsua tallennusta footerista suoraan, kuten redux-form-polulla.
// Silloin kirjasto ei tiedä tallennuksesta mitään: submitting ja submitErrors jäävät
// pysyvästi tyhjiksi, ja molemmat on pidettävä omassa contextissa. redux-formilla se
// ei ollut ongelma, koska sen elinkaarta ohjattiin action creatoreilla
// (startSubmit/stopSubmit) - react-final-formissa vastaavaa ei ole, joten ohitus
// maksaisi koko elinkaaren.
//
// Kirjastolta saadaan siis submitting, submitErrors, kenttien meta.submitError ja
// tuplaklikkaussuoja ilman omaa tilaa.

// Providerit omana komponenttina, koska submitting tulee <Form>in
// renderöintipropista eikä render-callbackin sisällä voi kutsua hookeja.
const FormProviders = ({
  formName,
  mode,
  disabled,
  submitting,
  submitHandlerRef,
  children,
}: any) => {
  // Lomake disabloi itsensä tallennuksen aikana.
  const formCtx = useMemo(
    () => ({ name: formName, disabled: disabled || submitting, mode }),
    [formName, disabled, submitting, mode]
  );

  return (
    <SubmitHandlerContext.Provider value={submitHandlerRef}>
      <FieldRegistryProvider>
        <FormContext.Provider value={formCtx}>{children}</FormContext.Provider>
      </FieldRegistryProvider>
    </SubmitHandlerContext.Provider>
  );
};

export const ReactFinalForm = ({
  form,
  mode,
  disabled = false,
  children,
  initialValues,
}) => {
  const submitHandlerRef = useRef<SubmitHandler | null>(null);

  // Pysyvä dispatcher: lukee refin KUTSUHETKELLÄ, joten kirjasto saa aina
  // tuoreimman käsittelijän ilman että <Form> alustuu uudelleen.
  const onSubmit = useCallback(
    async (values: any) =>
      submitHandlerRef.current ? submitHandlerRef.current(values) : undefined,
    []
  );

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      // Syvä vertailu, ei identiteettiä. react-final-formin oletus on shallowEqual, kun
      // redux-form enableReinitialize vertasi syvästi: ilman tätä pelkkä uusi olio
      // samalla sisällöllä alustaisi lomakkeen uudelleen ja hylkäisi käyttäjän kesken
      // olevat arvot, koska keepDirtyOnReinitialize ei ole päällä.
      initialValuesEqual={_.isEqual}
      mutators={{ ...arrayMutators }}
      // Vain submitting: juuri ei renderöidy arvomuutoksilla, mutta tarvitsee
      // tallennustilan disabloidakseen lomakkeen. Yksi renderi tallennusta kohti.
      subscription={{ submitting: true }}
    >
      {({ submitting }) => (
        <FormProviders
          formName={form}
          mode={mode}
          disabled={disabled}
          submitting={submitting}
          submitHandlerRef={submitHandlerRef}
        >
          {children}
        </FormProviders>
      )}
    </Form>
  );
};

export default ReactFinalForm;
