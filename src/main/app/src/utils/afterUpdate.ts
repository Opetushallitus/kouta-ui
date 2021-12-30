import { QueryClient, QueryKey } from 'react-query';

import { JULKAISUTILA } from '../constants';

export const afterUpdate = (
  queryClient: QueryClient,
  history,
  entityType: QueryKey,
  newTila: JULKAISUTILA
) => {
  const redirectToFrontpage = newTila && newTila === JULKAISUTILA.POISTETTU;
  const refetchActive = !newTila || newTila !== JULKAISUTILA.POISTETTU;

  queryClient.invalidateQueries(entityType, { refetchActive }).then(() => {
    if (redirectToFrontpage) {
      history.push('/');
    }
  });
};
