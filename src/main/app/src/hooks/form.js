import { useContext, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { isDirty, isSubmitting } from 'redux-form';
import formActions from 'redux-form/lib/actions';
import FormNameContext from '#/src/components/FormNameContext';
import FormConfigContext from '#/src/components/FormConfigContext';
import { useActions } from './redux';

export const useFormName = () => useContext(FormNameContext);

export const useForm = () => {
  const formName = useFormName();
  return useSelector(state => _.get(state, `form.${formName}`));
};

export function useBoundFormActions() {
  const formName = useFormName();
  const boundFormActions = useMemo(
    () =>
      _.mapValues(formActions, action => (...args) =>
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
export function useIsSubmitting() {
  const formName = useFormName();
  return useSelector(isSubmitting(formName));
}

export function useFieldValue(name) {
  const formName = useContext(FormNameContext);

  const selector = useCallback(
    state => _.get(state, `form.${formName}.values.${name}`),
    [formName, name]
  );

  return useSelector(selector);
}

export const useFormConfig = () => {
  const contextConfig = useContext(FormConfigContext);

  return useMemo(() => {
    return {
      sections: {},
      ...(contextConfig || {}),
    };
  }, [contextConfig]);
};
