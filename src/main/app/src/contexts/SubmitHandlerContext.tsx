import React, { useContext } from 'react';

// Tallennuksen toteutus rakennetaan lomakkeen SISÄLLÄ (useSaveForm footerissa), koska
// se tarvitsee kenttärekisterin näkyvyysjoukon ja lomakkeen arvot. react-final-form
// puolestaan haluaa onSubmitin <Form>-juurelle eli kontekstien ULKOPUOLELLE.
//
// Refi on silta: ReactFinalForm antaa <Form>ille pysyvän dispatcherin, joka lukee
// refin kutsuhetkellä, ja useSaveForm asettaa refiin oman käsittelijänsä. Vaihtoehto
// olisi nostaa koko tallennus sivutasolle, mutta silloin rekisteri ja arvot pitäisi
// nostaa myös - eli kahdeksan sivua ja kahdeksan footeria uusiksi.
export type SubmitHandler = (values: any) => Promise<any | undefined>;

export const SubmitHandlerContext =
  React.createContext<React.MutableRefObject<SubmitHandler | null> | null>(
    null
  );

SubmitHandlerContext.displayName = 'SubmitHandlerContext';

export const useSubmitHandlerRef = () => {
  const ref = useContext(SubmitHandlerContext);
  if (!ref) {
    throw new Error(
      'Tallennuskäsittelijän refiä ei löydy. Puuttuuko ReactFinalForm-wrapper?'
    );
  }
  return ref;
};

export default SubmitHandlerContext;
