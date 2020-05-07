import { useContext, useMemo, useCallback } from 'react';
import { useStore, useSelector } from 'react-redux';
import _ from 'lodash';
import formActions from 'redux-form/lib/actions';
import FormNameContext from '#/src/components/FormNameContext';
import * as formSelectors from './reduxFormSelectors';
import { useActions } from './redux';

export const useFormName = () => useContext(FormNameContext);

export function useBoundFormActions() {
  const formName = useFormName();
  const boundFormActions = useMemo(
    () =>
      _.mapValues(formActions, action => (...args) =>
        action.apply(null, [formName, ...args]),
      ),
    [formName],
  );
  return useActions(boundFormActions);
}

export function useBoundFormSelectors() {
  const formName = useFormName();
  const store = useStore();
  return useMemo(
    () =>
      _.mapValues(formSelectors, selector => () =>
        selector(formName)(store.getState()),
      ),
    [formName, store],
  );
}

export function useFieldValue(name) {
  const formName = useContext(FormNameContext);

  const selector = useCallback(
    state => _.get(state, `form.${formName}.values.${name}`),
    [formName, name],
  );

  return useSelector(selector);
}
