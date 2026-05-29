import { useMemo, useCallback, useEffect } from 'react';

import _ from 'lodash';
import { change, isDirty, isSubmitting, getFormSubmitErrors } from 'redux-form';
import formActions from 'redux-form/lib/actions';

import { useFormName } from '#/src/contexts/FormContext';
import { assert } from '#/src/utils';
import { getKielivalinta } from '#/src/utils/form/formConfigUtils';

import { useDispatch, useSelector } from './reduxHooks';
import { useActions } from './useActions';
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

export const useForm = (formNameProp?: string): FormStateWithCorrectTypes => {
  const formName = useFormName();

  return useSelector(state =>
    _.get(state, `form.${formNameProp ?? formName}`)
  ) as unknown as FormStateWithCorrectTypes;
};

export function useBoundFormActions() {
  const formName = useFormName();
  const boundFormActions = useMemo(
    () =>
      _.mapValues(
        formActions,
        (action: any) =>
          (...args: Array<any>) =>
            action(formName, ...args)
      ),
    [formName]
  );
  return useActions(boundFormActions);
}

export function useIsDirty(): boolean {
  const formName = useFormName();
  return useSelector(isDirty(formName));
}

export function useIsSubmitting(formNameProp?: string): boolean {
  const formName = useFormName();
  return useSelector(isSubmitting(formNameProp ?? formName));
}

export function useSubmitErrors<TErrors = Record<string, any>>(
  formNameProp?: string
): TErrors {
  const formName = useFormName();
  return useSelector(getFormSubmitErrors(formNameProp ?? formName)) as TErrors;
}

export function useFieldValue<T = any>(name: string, formNameProp?: string): T {
  const contextFormName = useFormName();
  const formName = formNameProp || contextFormName;

  assert(formName != null);

  const selector = useCallback(
    (state): any => _.get(state, `form.${formName}.values.${name}`),
    [formName, name]
  );

  return useSelector(selector);
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

    const selector = useCallback(
      (state): PathValue<TFormValues, TPath> | undefined =>
        _.get(state, `form.${formName}.values.${name}`) as
          | PathValue<TFormValues, TPath>
          | undefined,
      [formName, name]
    );

    return useSelector(selector);
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
  const formName = formNameProp || contextFormName;

  assert(formName != null);

  const selector = useCallback(
    (state): any => _.get(state, `form.${formName}.initial.${name}`),
    [formName, name]
  );

  return useSelector(selector);
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
  const dispatch = useDispatch();
  const currentValue = useFieldValue(name, form);
  const valueHasChanged = !_.isEqual(currentValue, value);
  useEffect(() => {
    if (condition && valueHasChanged) {
      dispatch(change(form, name, value));
    }
  }, [dispatch, form, name, value, valueHasChanged, condition]);
}

export const useSelectedLanguages = (): Array<LanguageCode> => {
  const formName = useFormName();
  return useSelector(state => getKielivalinta(state?.form?.[formName]?.values));
};
