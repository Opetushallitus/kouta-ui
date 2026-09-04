import React, { createContext, useContext } from 'react';

// Lomakekirjaston sovitin.
//
// hooks/form.ts on jo se rajapinta, jonka kautta koko sovellus lukee lomaketilaa: 138
// kutsupaikkaa käyttää useFieldValueä ja sen sisaruksia, eikä yksikään mainitse
// kirjastoa. Tämä sovitin on kerros SEN sisällä, ja sen ainoa tehtävä on sallia kahden
// toteutuksen olemassaolo yhtä aikaa kirjastonvaihdon ajan.
//
// Miksi sovitin eikä haarautuminen hookin sisällä: react-final-formin useField ja
// useFormState HEITTÄVÄT, jos niiden yläpuolella ei ole <Form>. Hookkeja ei myöskään
// voi kutsua ehdollisesti. Jaettu komponentti ei siis voi kysyä "kumpi kirjasto tässä
// on käytössä" ja kutsua oikeaa - molemmat pitäisi kutsua, ja väärä kaatuisi.
// Toteutus välitetään siksi contextin kautta, ja hookin identiteetti on vakaa koko
// sivun ajan, joten hookkien järjestyssääntö pysyy voimassa.
//
// TILAPÄINEN. Kun jokainen lomake on react-final-formilla, toteutuksia on yksi ja
// tämä kerros poistetaan: hooks/form.ts kutsuu kirjastoa suoraan eivätkä kutsupaikat
// huomaa mitään. Poisto on oma suunniteltu askeleensa - muuten tämä jää.

export type FormLibrary = 'redux-form' | 'react-final-form';

export type FormAdapter = {
  // Kertoo kenttäkääreelle (formFields/Field.tsx) kumman kirjaston komponentit
  // renderöidään. Tämä on ainoa kohta, jossa kirjasto on eksplisiittisesti näkyvissä
  // sovittimen rajapinnassa - kaikki muu on toteutuksen takana.
  library: FormLibrary;

  useFormState: (formName?: string) => any;
  useValue: (path: string, formName?: string) => any;
  useInitialValue: (path: string, formName?: string) => any;
  useIsDirty: () => boolean;
  useIsSubmitting: (formName?: string) => boolean;
  useSubmitErrors: (formName?: string) => any;
  useChange: () => (name: string, value: any) => void;

  // Tallennuksen elinkaari. redux-formilla nämä ovat action creatoreita, joten ne
  // ovat kirjastokohtaisia siinä missä tilan lukukin. Kolme riittää: aloitus,
  // lopetus virheineen, ja uudelleenalustus tallennuksen jälkeen (nollaa
  // dirty-tilan).
  useSubmitLifecycle: () => {
    startSubmit: () => void;
    stopSubmit: (errors?: any) => void;
    reinitialize: (values: any) => void;
  };
};

const FormAdapterContext = createContext<FormAdapter | null>(null);

FormAdapterContext.displayName = 'FormAdapterContext';

export const FormAdapterProvider = ({
  adapter,
  children,
}: {
  adapter: FormAdapter;
  children: React.ReactNode;
}) => (
  <FormAdapterContext.Provider value={adapter}>
    {children}
  </FormAdapterContext.Provider>
);

export const useFormAdapter = (): FormAdapter => {
  const adapter = useContext(FormAdapterContext);
  if (!adapter) {
    throw new Error(
      'useFormAdapter: lomakesovitinta ei löydy. Puuttuuko FormAdapterProvider?'
    );
  }
  return adapter;
};
