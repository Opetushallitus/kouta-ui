import { useContext, useMemo, useCallback, useEffect } from 'react';

import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { change, isDirty, isSubmitting, getFormSubmitErrors } from 'redux-form';
import formActions from 'redux-form/lib/actions';

import FormConfigContext from '#/src/contexts/FormConfigContext';
import { useFormName } from '#/src/contexts/FormNameContext';
import { assert } from '#/src/utils';
import { getKielivalinta } from '#/src/utils/form/formConfigUtils';

import { useActions } from './useActions';
import { useHasChanged } from './useHasChanged';

export const useForm = (formNameProp?: string) => {
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

export const useSetFieldValue = (name, value) => {
  const form = useFormName();
  const dispatch = useDispatch();
  const valueHasChanged = useHasChanged(value, _.isEqual);
  useEffect(() => {
    if (valueHasChanged) {
      dispatch(change(form, name, value));
    }
  }, [dispatch, form, name, value, valueHasChanged]);
};

export const useFormConfig = () => {
  const contextConfig = useContext(FormConfigContext);

  return useMemo(() => {
    return {
      sections: {},
      ...(contextConfig || {}),
    };
  }, [contextConfig]);
};

export const useSelectedLanguages = () => {
  const formName = useFormName();
  return useSelector(state => getKielivalinta(state?.form?.[formName]?.values));
};
