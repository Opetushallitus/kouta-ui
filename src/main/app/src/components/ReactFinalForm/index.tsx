import React, { useMemo, useState } from 'react';

import arrayMutators from 'final-form-arrays';
import { Form } from 'react-final-form';

import { FieldRegistryProvider } from '#/src/components/formFields/FieldRegistry';
import FormContext from '#/src/contexts/FormContext';
import { FormSubmitContext } from '#/src/contexts/FormSubmitContext';

// Lomakkeen juuri: renderöi <Form>, ja tarjoaa alipuulleen FormContextin,
// kenttärekisterin ja tallennuksen tilan.
//
// Kaksi asiaa, jotka eivät tule kirjastolta:
//
// 1. submitting ja submitErrors pidetään täällä. kouta ei käytä kirjaston
//    handleSubmitia vaan kutsuu footerista save():a suoraan, joten kirjasto ei tiedä
//    tallennuksesta mitään. Samasta syystä onSubmit on pakollinen propsi mutta jää
//    käyttämättä.
// 2. FieldArray vaatii arrayMutators-mutaattorit erikseen.
export const ReactFinalForm = ({
  form,
  mode,
  disabled = false,
  children,
  initialValues,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitErrors, setSubmitErrors] = useState<any>(undefined);

  // Lomake disabloi itsensa tallennuksen aikana. Aiemmin FormPage laski taman
  // (disabled={isSubmitting || readOnly}) ja luki isSubmittingin lomakkeen
  // YLAPUOLELTA, mika toimi vain koska redux-formin tila oli globaali. Nyt tila
  // asuu tassa komponentissa, joten se myos yhdistetaan tassa - eika FormPagen
  // tarvitse lukea lomaketilaa ennen lomakkeen luomista.
  const formCtx = useMemo(
    () => ({ name: form, disabled: disabled || isSubmitting, mode }),
    [form, disabled, isSubmitting, mode]
  );

  const submitState = useMemo(
    () => ({ isSubmitting, submitErrors, setIsSubmitting, setSubmitErrors }),
    [isSubmitting, submitErrors]
  );

  return (
    <Form
      onSubmit={() => undefined}
      initialValues={initialValues}
      mutators={{ ...arrayMutators }}
      subscription={{}}
    >
      {() => (
        <FormSubmitContext.Provider value={submitState}>
          <FieldRegistryProvider initialValues={initialValues}>
            <FormContext.Provider value={formCtx}>
              {children}
            </FormContext.Provider>
          </FieldRegistryProvider>
        </FormSubmitContext.Provider>
      )}
    </Form>
  );
};

export default ReactFinalForm;
