import { useCallback } from 'react';

import { useHistory } from 'react-router-dom';

import { POHJAVALINTA } from '#/src/constants';
import { assignQueryString } from '#/src/utils/assignQueryString';

export const useSelectBase = ({ kopioParam = 'kopio' } = {}) => {
  const history = useHistory();
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
