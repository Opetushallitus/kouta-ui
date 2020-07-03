import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { isArray } from 'lodash';

export function useActions(actions, deps = []) {
  const dispatch = useDispatch();
  return useMemo(() => {
    if (isArray(actions)) {
      return actions.map(a => bindActionCreators(a, dispatch));
    }
    return bindActionCreators(actions, dispatch);
  }, [actions, dispatch]);
}
