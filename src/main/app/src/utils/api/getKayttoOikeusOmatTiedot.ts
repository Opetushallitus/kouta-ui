import { useApiQuery } from '#/src/hooks/useApiQuery';
import { retryOnRedirect } from '#/src/utils';
// Need to retry getMe a few times, because often session is not created when first called
// 'kayttooikeus-service.me' is redirected (302) to /cas/login which can be detected checking
// if the response URL has changed.

const getKayttoOikeusOmatTiedot = async ({ httpClient, apiUrls }) => {
  return retryOnRedirect({
    httpClient,
    targetUrl: apiUrls.url('kayttooikeus-service.omattiedot'),
  });
};

export const useKayttoOikeusOmatTiedot = () => {
  return useApiQuery<{
    oidHenkilo: string;
  }>(
    'getMe',
    getKayttoOikeusOmatTiedot,
    {},
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
    }
  );
};
