import { useContext, useMemo } from 'react';
import { useStore } from 'react-redux';
import { mapValues } from 'lodash';
import formActions from 'redux-form/lib/actions';
import * as formSelectors from './reduxFormSelectors';
import FormNameContext from '../components/FormNameContext';
import { useActions } from './redux';

export const useFormName = () => useContext(FormNameContext);

export function useBoundFormActions() {
  const formName = useFormName();
  const boundFormActions = useMemo(
    () =>
      mapValues(formActions, action => (...args) =>
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
      mapValues(formSelectors, selector => () =>
        selector(formName)(store.getState()),
      ),
    [formName, store],
  );
}
