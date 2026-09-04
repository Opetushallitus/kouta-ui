import React, { useContext } from 'react';

// Tallennuksen tila: onko tallennus kesken, ja mitä virheitä se palautti.
//
// Miksi omana contextinaan eikä kirjastolta: kouta ei tallenna react-final-formin
// handleSubmitin kautta vaan kutsuu footerista save():a suoraan, joten kirjasto ei
// tiedä tallennuksesta mitään - sen submitting ja submitErrors jäisivät pysyvästi
// tyhjiksi. ReactFinalForm-kääre pitää tilan ja tarjoaa sen tästä.
//
// Erillään FormContextista, koska FormContext on vakaa lomakkeen elinajan (nimi,
// disabled, mode) kun taas tämä muuttuu jokaisella tallennuksella. Yhdistettynä
// jokainen tallennus renderöisi uudelleen kaiken, mikä lukee lomakkeen nimeä.

type FormSubmitContextType = {
  isSubmitting: boolean;
  submitErrors: any;
  setIsSubmitting: (value: boolean) => void;
  setSubmitErrors: (errors: any) => void;
};

export const FormSubmitContext =
  React.createContext<FormSubmitContextType | null>(null);

FormSubmitContext.displayName = 'FormSubmitContext';

export const useFormSubmitContext = (): FormSubmitContextType => {
  const context = useContext(FormSubmitContext);
  if (!context) {
    throw new Error(
      'Lomakkeen tallennustilaa ei löydy. Puuttuuko ReactFinalForm-kääre?'
    );
  }
  return context;
};

export default FormSubmitContext;
