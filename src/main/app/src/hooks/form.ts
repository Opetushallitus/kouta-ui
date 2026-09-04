import { useMemo, useEffect } from 'react';

import _ from 'lodash';

import { useFormName } from '#/src/contexts/FormContext';
import { assert } from '#/src/utils';
import { getKielivalinta } from '#/src/utils/form/formConfigUtils';

import { useFormAdapter } from './formAdapter';
import { HakukohdeFormValues } from '../types/hakukohdeTypes';
import { HakuFormValues } from '../types/hakuTypes';
import { KoulutusFormValues } from '../types/koulutusTypes';
import { ToteutusFormValues } from '../types/toteutusTypes';
import { ValintaperusteFormValues } from '../types/valintaperusteTypes';

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

export const useForm = (formNameProp?: string): FormStateWithCorrectTypes =>
  useFormAdapter().useFormState(formNameProp) as FormStateWithCorrectTypes;

// Palauttaa vain changen. Aiemmin tämä sitoi redux-formin KOKO action creator
// -pinnan lomakkeeseen, mutta kutsupaikoista käytetään yksinomaan changea (16
// paikkaa, kaikki purkavat sen destrukturoiden). Kapea rajapinta on myös se, mikä
// tekee kirjastonvaihdosta mahdollisen: react-final-formissa ei ole vastaavaa
// action creator -pinnan kokoelmaa.
export function useBoundFormActions() {
  const change = useFormAdapter().useChange();
  return useMemo(() => ({ change }), [change]);
}

export function useIsDirty(): boolean {
  return useFormAdapter().useIsDirty();
}

export function useIsSubmitting(formNameProp?: string): boolean {
  return useFormAdapter().useIsSubmitting(formNameProp);
}

export function useSubmitErrors<TErrors = Record<string, any>>(
  formNameProp?: string
): TErrors {
  return useFormAdapter().useSubmitErrors(formNameProp) as TErrors;
}

export function useFieldValue<T>(name: string, formNameProp?: string): T {
  const contextFormName = useFormName();
  assert((formNameProp || contextFormName) != null);

  return useFormAdapter().useValue(name, formNameProp);
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

    return useFormAdapter().useValue(name) as
      | PathValue<TFormValues, TPath>
      | undefined;
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

  return useFormAdapter().useInitialValue(name, formNameProp);
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
  const change = useFormAdapter().useChange();
  const currentValue = useFieldValue(name, form);
  const valueHasChanged = !_.isEqual(currentValue, value);
  useEffect(() => {
    if (condition && valueHasChanged) {
      change(name, value);
    }
  }, [change, name, value, valueHasChanged, condition]);
}

export const useSelectedLanguages = (): Array<LanguageCode> => {
  const form = useFormAdapter().useFormState();
  return getKielivalinta(form?.values);
};
