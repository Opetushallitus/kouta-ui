import { useCallback, useMemo, useEffect } from 'react';

import _ from 'lodash';
import {
  useField,
  useForm as useRffForm,
  useFormState,
} from 'react-final-form';

import { useFieldRegistry } from '#/src/components/formFields/FieldRegistry';
import { useFormName } from '#/src/contexts/FormContext';
import { useFormSubmitContext } from '#/src/contexts/FormSubmitContext';
import { assert } from '#/src/utils';
import { getKielivalinta } from '#/src/utils/form/formConfigUtils';

import { HakukohdeFormValues } from '../types/hakukohdeTypes';
import { HakuFormValues } from '../types/hakuTypes';
import { KoulutusFormValues } from '../types/koulutusTypes';
import { ToteutusFormValues } from '../types/toteutusTypes';
import { ValintaperusteFormValues } from '../types/valintaperusteTypes';

// Tämä moduuli on koko sovelluksen rajapinta lomaketilaan: ~200 kutsupaikkaa käyttää
// useFieldValueä ja sen sisaruksia, eikä yksikään mainitse lomakekirjastoa. Siksi
// react-final-form saa esiintyä täällä ja vain täällä (.eslintrc.js).
//
// HUOM formNameProp: kaikki alla olevat hookit ottavat sen yhteensopivuuden vuoksi ja
// JÄTTÄVÄT SEN HUOMIOTTA. Se on redux-formin globaalin storen aikakauden käsite -
// silloin lomaketilaan pystyi osoittamaan nimellä mistä tahansa. react-final-formissa
// tila asuu lomakkeen sisällä, ja yksikään kutsupaikka ei anna toisen lomakkeen nimeä,
// vain oman - mikä on tässä implisiittistä.

// Utility type to generate all valid paths from a type (depth 3 avoids recursing into complex library types)
type Paths<T, D extends number = 3> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T]-?: K extends string | number
          ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
          : never;
      }[keyof T]
    : '';

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Utility type to extract nested property types from a path string
type PathValue<T, P extends string> = P extends keyof T
  ? T[P]
  : P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
      ? PathValue<T[K], Rest>
      : any
    : any;

// Type for Redux Form state - overrides incorrect Redux Form types
// At runtime, registeredFields is actually a Record, not an array
type FormStateWithCorrectTypes = {
  registeredFields: Record<string, { name: string }>;
  values?: any;
  initial?: any;
  [key: string]: any;
};

export const useForm = (): FormStateWithCorrectTypes => {
  const state = useFormState({
    subscription: { values: true, initialValues: true },
  });
  const registry = useFieldRegistry();

  // registeredFields tulee OMASTA rekisteristä, ei kirjastolta.
  //
  // react-final-formin form.getRegisteredFields() on tähän liian laaja: useField
  // rekisteröi kentän myös pelkästä lukemisesta, ja useFieldValue kulkee sen kautta -
  // eli jokainen arvon luku rekisteröisi kenttänsä. Näkyvyyssääntö tarkoittaa
  // RENDERÖITYJÄ kenttiä, ja vain oma rekisteri seuraa niitä. Kirjaston joukkoa ei
  // tarjota tässä lainkaan, jottei väärää vastausta voi vahingossa kysyä.
  if (!registry) {
    // Ei hiljaista varasuunnitelmaa. Tyhjä joukko tarkoittaisi "mitään ei ole
    // rekisteröity": createErrorBuilderin isVisible palauttaisi falsen joka polulle,
    // jolloin validointi katoaisi kokonaan, ja getValuesForSaving putoaisi
    // initialValues-kloonin ja sallittujen polkujen varaan. Tallennus menisi läpi
    // hiljaa ja väärin. Mieluummin kova virhe mountissa.
    throw new Error(
      'Kenttärekisteriä ei löydy. ReactFinalForm-kääreen pitää renderöidä ' +
        'FieldRegistryProvider.'
    );
  }

  return {
    values: state.values,
    initial: state.initialValues,

    // Getterit, EIVÄT tilannekuvia. Rekisteri elää refeissä eikä FieldRegistryProvider
    // renderöi uudelleen kenttien mountatessa - se on tarkoituksellista, koska muuten
    // kielivälilehden vaihto aiheuttaisi satoja uudelleenrenderöintejä. Renderin aikana
    // luettu arvo olisi siis helposti tyhjä tai vanhentunut: footer, joka pitää kiinni
    // const form = useForm():sta, lukisi joukon ennen kuin kentät ehtivät
    // rekisteröityä. Getterinä se evaluoituu vasta lukuhetkellä, joka on
    // tallennushetki.
    get registeredFields() {
      return registry.getRegisteredFields();
    },

    get unregisteredFields() {
      return registry.getUnregisteredFields();
    },
  } as FormStateWithCorrectTypes;
};

const useChange = () => {
  const form = useRffForm();
  return useCallback(
    (name: string, value: any) => form.change(name, value),
    [form]
  );
};

// Tallennuksen elinkaari. Kolme vaihetta riittaa: aloitus, lopetus virheineen, ja
// uudelleenalustus tallennuksen jalkeen. reinitialize vastaa redux-formin initializea:
// se asettaa uuden lahtotilan, jolloin dirty nollautuu eika "tallentamattomia
// muutoksia" -varoitus jaa paalle.
export const useSubmitLifecycle = () => {
  const form = useRffForm();
  const { setIsSubmitting, setSubmitErrors } = useFormSubmitContext();
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
      reinitialize: (values: any) => form.initialize(values),
    }),
    [form, setIsSubmitting, setSubmitErrors]
  );
};

// Palauttaa vain changen. Aiemmin tämä sitoi redux-formin KOKO action creator
// -pinnan lomakkeeseen, mutta kutsupaikoista käytetään yksinomaan changea (16
// paikkaa, kaikki purkavat sen destrukturoiden). Kapea rajapinta on myös se, mikä
// tekee kirjastonvaihdosta mahdollisen: react-final-formissa ei ole vastaavaa
// action creator -pinnan kokoelmaa.
export function useBoundFormActions() {
  const change = useChange();
  return useMemo(() => ({ change }), [change]);
}

export function useIsDirty(): boolean {
  return Boolean(useFormState({ subscription: { dirty: true } }).dirty);
}

export function useIsSubmitting(): boolean {
  return useFormSubmitContext().isSubmitting;
}

export function useSubmitErrors<TErrors = Record<string, any>>(): TErrors {
  return useFormSubmitContext().submitErrors as TErrors;
}

// RAAKA arvo, ei muotoiltu. react-final-formin oletus-format muuttaa undefinedin
// tyhjaksi merkkijonoksi, jolloin lukija ei erota "ei arvoa" tyhjasta arvosta.
//
// Ero ei ole teoreettinen. ToteutusForm/TiedotSection.tsx:153 asettaa
// isPieniOsaamiskokonaisuuden oletusarvon efektissa, jonka ehto on
// _fp.isUndefined(currValue). Muotoiltuna arvo oli '', ehto ei tayttynyt koskaan, eika
// kenttaa asetettu - runkosnapshot menetti isPieniOsaamiskokonaisuus: true
// yhdessatoista Toteutus-testissa. Identiteettimuotoilu kytkee oletusmuotoilun pois
// tasta lukijasta; kenttien renderointiin se ei vaikuta, se on eri useField-kutsu.
const useRawValue = (name: string) =>
  useField(name, {
    subscription: { value: true },
    format: value => value,
  }).input.value;

export function useFieldValue<T>(name: string, formNameProp?: string): T {
  const contextFormName = useFormName();
  assert((formNameProp || contextFormName) != null);

  return useRawValue(name);
}

/**
 * Create a type-safe field value hook for a specific form type.
 *
 * PERFORMANCE: Each field gets its own useSelector subscription, so components
 * only re-render when the specific fields they use change (not on every form change).
 *
 * @template TFormValues - The form values type (e.g., KoulutusFormValues)
 * @returns A hook function that validates paths and infers return types
 *
 * @example
 * import { KoulutusFormValues } from '#/src/types/koulutusTypes';
 *
 * // Create the typed hook once (can be at module level)
 * const useField = makeFormHooks<KoulutusFormValues>();
 *
 * const Component = () => {
 *   // Each field gets its own subscription - efficient!
 *   const koulutustyyppi = useField('koulutustyyppi'); // KOULUTUSTYYPPI | undefined
 *   const kieliversiot = useField('kieliversiot'); // Array<LanguageCode> | undefined
 *   const koulutus = useField('information.koulutus'); // SelectOption | undefined
 *
 *   // TypeScript error - invalid path:
 *   // const invalid = useField('nonexistent');
 * };
 */
export function makeFormFieldHook<TFormValues>() {
  return function useField<TPath extends Paths<TFormValues>>(
    name: TPath
  ): PathValue<TFormValues, TPath> | undefined {
    const formName = useFormName();
    assert(formName != null);

    return useRawValue(name) as PathValue<TFormValues, TPath> | undefined;
  };
}

export const useKoulutusFormField = makeFormFieldHook<KoulutusFormValues>();
export const useToteutusFormField = makeFormFieldHook<ToteutusFormValues>();
export const useHakuFormField = makeFormFieldHook<HakuFormValues>();
export const useHakukohdeFormField = makeFormFieldHook<HakukohdeFormValues>();
export const useValintaperusteFormField =
  makeFormFieldHook<ValintaperusteFormValues>();

/**
 * Get an initial field value from the form state.
 * Returns untyped value - use type assertions if needed.
 *
 * @param name - The field path (e.g., 'kieliversiot', 'information.koulutus')
 * @param formNameProp - Optional form name override
 * @returns The initial field value
 *
 * @example
 * const initialTila = useInitialFieldValue('tila') as JULKAISUTILA | undefined;
 */
export function useInitialFieldValue(name: string, formNameProp?: string): any {
  const contextFormName = useFormName();
  assert((formNameProp || contextFormName) != null);

  return useField(name, { subscription: { initial: true } }).meta.initial;
}

/**
 * Set a field value in the form state.
 * The field will only be updated if the value has changed and the condition is true.
 *
 * @param name - The field path (e.g., 'kieliversiot', 'information.koulutus')
 * @param value - The value to set
 * @param condition - Only update if this is true (default: true)
 *
 * @example
 * useSetFieldValue('kieliversiot', ['fi', 'sv']);
 * useSetFieldValue('information.koulutus', { value: '123', label: 'Koulutus' });
 */
export function useSetFieldValue(
  name: string,
  value: any,
  condition = true
): void {
  const form = useFormName();
  const change = useChange();
  const currentValue = useFieldValue(name, form);
  const valueHasChanged = !_.isEqual(currentValue, value);
  useEffect(() => {
    if (condition && valueHasChanged) {
      change(name, value);
    }
  }, [change, name, value, valueHasChanged, condition]);
}

export const useSelectedLanguages = (): Array<LanguageCode> => {
  const values = useFormState({ subscription: { values: true } }).values;
  return getKielivalinta(values);
};
