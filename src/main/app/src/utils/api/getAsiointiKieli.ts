import { useApiQuery } from '#/src/hooks/useApiQuery';

import { retryOnRedirect } from '..';

export const getAsiointiKieli = async ({ httpClient, apiUrls }) => {
  return retryOnRedirect({
    httpClient,
    targetUrl: apiUrls.url('oppijanumerorekisteri-service.asiointiKieli'),
  });
};

export const useAsiointiKieli = () =>
  useApiQuery('getAsiointiKieli', {}, getAsiointiKieli, {
    retry: 0,
    refetchOnWindowFocus: false,
  });
