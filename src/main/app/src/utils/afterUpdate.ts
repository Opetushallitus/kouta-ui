import { QueryClient, QueryKey } from 'react-query';
import { NavigateFunction } from 'react-router-dom';

import { JULKAISUTILA } from '../constants';

export const afterUpdate = (
  queryClient: QueryClient,
  navigate: NavigateFunction,
  entityType: QueryKey,
  newTila: JULKAISUTILA
) => {
  const redirectToFrontpage = newTila && newTila === JULKAISUTILA.POISTETTU;
  const refetchActive = !newTila || newTila !== JULKAISUTILA.POISTETTU;

  queryClient.invalidateQueries(entityType, { refetchActive }).then(() => {
    if (redirectToFrontpage) {
      navigate('/');
    }
  });
};
