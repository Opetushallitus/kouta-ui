import { useCallback } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { POHJAVALINTA } from '#/src/constants';
import { assignQueryString } from '#/src/utils/assignQueryString';

export const useSelectBase = ({ kopioParam = 'kopio' } = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  return useCallback(
    ({ tapa, valinta }) => {
      const { search } = location;

      const setNewSearch = (newSearch: string) => {
        return (
          (newSearch !== search &&
            navigate(
              {
                search: newSearch,
              },
              { replace: true }
            )) ||
          navigate
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
    [kopioParam, location, navigate]
  );
};
