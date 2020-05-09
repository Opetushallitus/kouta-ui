import { useCallback } from 'react';

import { POHJAVALINTA } from '../../constants';
import assignQueryString from '../../utils/assignQueryString';

const useSelectBase = (history, { kopioParam = 'kopio' } = {}) => {
  return useCallback(
    ({ tapa, valinta }) => {
      const {
        location: { search },
      } = history;

      const setNewSearch = newSearch => {
        return (
          (newSearch !== search &&
            history.replace({
              search: newSearch,
            })) ||
          history
        );
      };
      if (tapa === POHJAVALINTA.KOPIO && valinta) {
        return setNewSearch(
          assignQueryString(search, {
            [kopioParam]: valinta,
          })
        );
      }

      return setNewSearch(
        assignQueryString(search, {
          [kopioParam]: undefined,
        })
      );
    },
    [kopioParam, history]
  );
};

export default useSelectBase;
