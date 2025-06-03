import { useMemo, useCallback, useEffect } from 'react';

import _ from 'lodash';
import { change, isDirty, isSubmitting, getFormSubmitErrors } from 'redux-form';
import formActions from 'redux-form/lib/actions';

import { useFormName } from '#/src/contexts/FormContext';
import { assert } from '#/src/utils';
import { getKielivalinta } from '#/src/utils/form/formConfigUtils';

import { useDispatch, useSelector } from './reduxHooks';
import { useActions } from './useActions';

export const useForm: (formNameProp?: string) => any = (
  formNameProp?: string
) => {
  const formName = useFormName();

  return useSelector(state => _.get(state, `form.${formNameProp || formName}`));
};

export function useBoundFormActions() {
  const formName = useFormName();
  const boundFormActions = useMemo(
    () =>
      _.mapValues(
        formActions,
        action =>
          (...args) =>
            action.apply(null, [formName, ...args])
      ),
    [formName]
  );
  return useActions(boundFormActions);
}

export function useIsDirty() {
  const formName = useFormName();
  return useSelector(isDirty(formName));
}

export function useIsSubmitting(formNameProp?: string) {
  const formName = useFormName();
  return useSelector(isSubmitting(formNameProp ?? formName));
}
export function useSubmitErrors(formNameProp) {
  const formName = useFormName();
  return useSelector(getFormSubmitErrors(formNameProp ?? formName));
}

export function useFieldValue<T = any>(name, formNameProp?: string): T {
  const contextFormName = useFormName();
  const formName = formNameProp || contextFormName;

  assert(formName != null);

  const selector = useCallback(
    state => _.get(state, `form.${formName}.values.${name}`),
    [formName, name]
  );

  return useSelector(selector);
}

export function useInitalFieldValue<T = any>(name, formNameProp?: string): T {
  const contextFormName = useFormName();
  const formName = formNameProp || contextFormName;

  assert(formName != null);

  const selector = useCallback(
    state => _.get(state, `form.${formName}.initial.${name}`),
    [formName, name]
  );

  return useSelector(selector);
}
export const useSetFieldValue = (name, value, condition = true) => {
  const form = useFormName();
  const dispatch = useDispatch();
  const currentValue = useFieldValue(name, form);
  const valueHasChanged = !_.isEqual(currentValue, value);
  useEffect(() => {
    if (condition && valueHasChanged) {
      dispatch(change(form, name, value));
    }
  }, [dispatch, form, name, value, valueHasChanged, condition]);
};

export const useSelectedLanguages = () => {
  const formName = useFormName();
  return useSelector(state => getKielivalinta(state?.form?.[formName]?.values));
};
