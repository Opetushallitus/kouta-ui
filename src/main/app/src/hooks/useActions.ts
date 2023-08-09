import { useMemo } from 'react';

import _ from 'lodash';
import { bindActionCreators } from 'redux';

import { useDispatch } from './reduxHooks';

export function useActions(actions) {
  const dispatch = useDispatch();
  return useMemo(() => {
    if (_.isArray(actions)) {
      return actions.map(a => bindActionCreators(a, dispatch));
    }
    return bindActionCreators(actions, dispatch);
  }, [actions, dispatch]);
}
