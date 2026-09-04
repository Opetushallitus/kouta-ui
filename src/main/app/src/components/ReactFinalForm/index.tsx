import React, { useMemo, useState } from 'react';

import arrayMutators from 'final-form-arrays';
import { Form } from 'react-final-form';

import { FieldRegistryProvider } from '#/src/components/formFields/FieldRegistry';
import FormContext from '#/src/contexts/FormContext';
import { FormAdapterProvider } from '#/src/hooks/formAdapter';
import { createReactFinalFormAdapter } from '#/src/hooks/formAdapterReactFinalForm';

// react-final-form-vastine ReduxForm-kääreelle. Sama rakenne, sama vastuu: renderöi
// lomake, tarjoa FormContext, kenttärekisteri ja lomakesovitin.
//
// Kolme eroa, jotka kaikki johtuvat samasta syystä - react-final-formin tila on
// lomakekohtainen eikä globaali:
//
// 1. Sovitin annetaan TÄSSÄ, ei sovelluksen juuressa. Se ohittaa juuren
//    redux-form-sovittimen tämän lomakkeen alipuussa, ja vain siellä.
// 2. submitting ja submitErrors pidetään kääreen omassa tilassa. kouta ei käytä
//    kirjaston handleSubmitia vaan kutsuu footerista save():a suoraan, joten
//    kirjasto ei tiedä tallennuksesta mitään.
// 3. FieldArray vaatii arrayMutators-mutaattorit; redux-formissa ne tulivat mukana.
//
// onSubmit on pakollinen propsi, mutta jää käyttämättä samasta syystä kuin kohdassa
// 2: tallennus kulkee footerin save():n kautta.
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

  const adapter = useMemo(
    () =>
      createReactFinalFormAdapter({
        isSubmitting,
        submitErrors,
        setIsSubmitting,
        setSubmitErrors,
      }),
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
        <FormAdapterProvider adapter={adapter}>
          <FieldRegistryProvider initialValues={initialValues}>
            <FormContext.Provider value={formCtx}>
              {children}
            </FormContext.Provider>
          </FieldRegistryProvider>
        </FormAdapterProvider>
      )}
    </Form>
  );
};

export default ReactFinalForm;
