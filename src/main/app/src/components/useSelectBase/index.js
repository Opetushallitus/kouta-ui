import { useCallback } from 'react';

import { POHJAVALINTA } from '../../constants';
import assignQueryString from '../../utils/assignQueryString';

const useSelectBase = (history, { kopioParam = 'kopio' } = {}) => {
  const selectBase = useCallback(
    ({ tapa, valinta }) => {
      const {
        location: { search },
      } = history;

      if (tapa === POHJAVALINTA.KOPIO && valinta) {
        return history.replace({
          search: assignQueryString(search, {
            [kopioParam]: valinta,
          }),
        });
      }

      return history.replace({
        search: assignQueryString(search, {
          [kopioParam]: undefined,
        }),
      });
    },
    [kopioParam, history],
  );

  return selectBase;
};

export default useSelectBase;
