import { QueryClient } from '@tanstack/react-query';
import { NavigateFunction } from 'react-router';

import { JULKAISUTILA } from '../constants';

export const afterUpdate = (
  queryClient: QueryClient,
  navigate: NavigateFunction,
  entityType: string,
  newTila?: JULKAISUTILA
) => {
  const redirectToFrontpage = newTila && newTila === JULKAISUTILA.POISTETTU;
  const refetchActive = !newTila || newTila !== JULKAISUTILA.POISTETTU;

  queryClient
    .invalidateQueries({
      queryKey: [entityType],
      refetchType: refetchActive ? 'active' : 'none',
    })
    .then(() => {
      if (redirectToFrontpage) {
        navigate('/');
      }
    });
};
