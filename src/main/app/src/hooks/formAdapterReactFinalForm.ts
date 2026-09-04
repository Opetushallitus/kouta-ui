import { useCallback, useMemo } from 'react';

import {
  useField,
  useForm as useRffForm,
  useFormState,
} from 'react-final-form';

import { useFieldRegistry } from '#/src/components/formFields/FieldRegistry';
import { FormAdapter } from '#/src/hooks/formAdapter';

// react-final-form-toteutus lomakesovittimelle.
//
// Rakenteellinen ero redux-formiin: tila on LOMAKEKOHTAINEN. Siksi tämä sovitin
// annetaan vain oman lomakkeensa alipuulle (ks. ReactFinalForm-kääre), kun taas
// redux-form-toteutus annetaan sovelluksen juuressa. Tämän toteutuksen hookit
// heittävät, jos niiden yläpuolella ei ole <Form>.
//
// formName-parametri jätetään huomiotta: se on redux-formin globaalin storen
// aikakauden käsite, eikä kutsupaikoista yksikään anna sitä toisen lomakkeen
// nimenä - vain oman lomakkeensa nimenä, mikä on tässä implisiittistä.
//
// submitting ja submitErrors eivät tule kirjastolta. kouta ei käytä
// react-final-formin omaa handleSubmitia vaan kutsuu footerista save():a
// suoraan, joten nämä kaksi pidetään kääreen omassa tilassa ja välitetään tänne.

export const createReactFinalFormAdapter = ({
  isSubmitting,
  submitErrors,
  setIsSubmitting,
  setSubmitErrors,
}: {
  isSubmitting: boolean;
  submitErrors: any;
  setIsSubmitting: (value: boolean) => void;
  setSubmitErrors: (errors: any) => void;
}): FormAdapter => ({
  library: 'react-final-form',

  useFormState: () => {
    const state = useFormState({
      subscription: { values: true, initialValues: true },
    });
    const registry = useFieldRegistry();

    // registeredFields tulee OMASTA rekisteristä, ei kirjastolta.
    //
    // react-final-formin form.getRegisteredFields() on tähän tarkoitukseen liian
    // laaja: useField rekisteröi kentän myös pelkästä lukemisesta, ja sovittimen
    // useValue kulkee sen kautta - eli jokainen useFieldValue-kutsu rekisteröi
    // kenttänsä. Näkyvyyssääntö tarkoittaa RENDERÖITYJÄ kenttiä, ja vain oma
    // rekisteri seuraa niitä.
    //
    // Kirjaston joukkoa ei tarjota tässä lainkaan, jotta väärää vastausta ei voi
    // vahingossa kysyä. Suora lukija on olemassa kahdessa footerissa
    // (ValintaperusteFooter, ToteutusFooter), ja ne ovat seuraavia siirrettäviä.
    if (!registry) {
      // Ei hiljaista varasuunnitelmaa. Tyhjä joukko tarkoittaisi "mitään ei ole
      // rekisteröity": createErrorBuilderin isVisible palauttaisi falsen joka
      // polulle, jolloin validointi katoaisi kokonaan, ja getValuesForSaving
      // putoaisi initialValues-kloonin ja sallittujen polkujen varaan. Tallennus
      // menisi läpi hiljaa ja väärin. Mieluummin kova virhe mountissa.
      throw new Error(
        'Lomakesovitin ei löydä kenttärekisteriä. ReactFinalForm-kääreen pitää ' +
          'renderöidä FieldRegistryProvider sovittimen alle.'
      );
    }

    return {
      values: state.values,
      initial: state.initialValues,

      // Getter, EI tilannekuvaa. Rekisteri elää refeissä eikä FieldRegistryProvider
      // renderöi uudelleen kenttien mountatessa - se on tarkoituksellista, koska
      // muuten kielivälilehden vaihto aiheuttaisi satoja uudelleenrenderöintejä.
      // Renderin aikana luettu arvo olisi siis helposti tyhjä tai vanhentunut:
      // footer, joka pitää kiinni const form = useForm():sta, lukisi joukon ennen
      // kuin kentät ehtivät rekisteröityä. Getterinä se evaluoituu vasta
      // lukuhetkellä, joka on tallennushetki.
      //
      // redux-form-toteutuksessa tätä ongelmaa ei ole, koska useSelector on
      // reaktiivinen ja store on totuuden lähde.
      get registeredFields() {
        return registry.getRegisteredFields();
      },

      // Poistuneet kentät samasta rekisteristä ja samalla perusteella kuin
      // registeredFields: getterinä, jotta arvo luetaan lukuhetkellä eikä renderin
      // aikana. Rungon rakentavat footerit tarvitsevat molemmat joukot, ja ne saavat
      // ne sovittimelta - eivät rekisteriltä suoraan.
      get unregisteredFields() {
        return registry.getUnregisteredFields();
      },
    };
  },

  // HUOM: sekä useValue että useInitialValue kulkevat useFieldin kautta, joka
  // REKISTERÖI kentän kirjastoon jo pelkästä lukemisesta. Se on kirjastojen
  // semanttinen ero redux-formiin, jossa useSelector vain lukee. Sivuvaikutus on
  // vaaraton niin kauan kuin näkyvyyssääntö nojaa omaan rekisteriin - ks.
  // useFormState yllä.
  // RAAKA arvo, ei muotoiltu. react-final-formin oletus-format muuttaa undefinedin
  // tyhjäksi merkkijonoksi, jolloin input.value ei kerro onko kentällä arvoa.
  // redux-form-toteutus lukee arvon suoraan storesta, eli undefined pysyy
  // undefinedina - ja sovittimen pitää antaa sama vastaus kummallakin kirjastolla.
  //
  // Ero ei ole teoreettinen. ToteutusForm/TiedotSection.tsx:153 asettaa
  // isPieniOsaamiskokonaisuuden oletusarvon efektissä, jonka ehto on
  // _fp.isUndefined(currValue). Muotoiltuna arvo oli '', ehto ei täyttynyt koskaan,
  // eikä kenttää asetettu - runkosnapshot menetti isPieniOsaamiskokonaisuus: true
  // yhdessätoista Toteutus-testissä.
  //
  // Identiteettimuotoilu kytkee kirjaston oletusmuotoilun pois tästä lukijasta.
  // Kenttien renderöintiin se ei vaikuta: se on eri useField-kutsu.
  useValue: (path: string) =>
    useField(path, {
      subscription: { value: true },
      format: value => value,
    }).input.value,

  useInitialValue: (path: string) =>
    useField(path, { subscription: { initial: true } }).meta.initial,

  useIsDirty: () =>
    Boolean(useFormState({ subscription: { dirty: true } }).dirty),

  useIsSubmitting: () => isSubmitting,

  useSubmitErrors: () => submitErrors,

  useChange: () => {
    const form = useRffForm();
    return useCallback(
      (name: string, value: any) => form.change(name, value),
      [form]
    );
  },

  useSubmitLifecycle: () => {
    const form = useRffForm();
    return useMemo(
      () => ({
        startSubmit: () => {
          setIsSubmitting(true);
          setSubmitErrors(undefined);
        },
        stopSubmit: (errors?: any) => {
          setIsSubmitting(false);
          setSubmitErrors(errors);
        },
        // Vastaa redux-formin initializea: asettaa uuden lähtötilan, jolloin
        // dirty nollautuu.
        reinitialize: (values: any) => form.initialize(values),
      }),
      [form]
    );
  },
});
