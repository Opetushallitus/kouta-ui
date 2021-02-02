import { retryOnRedirect } from '#/src/utils';
// Need to retry getMe a few times, because often session is not created when first called
// 'kayttooikeus-service.me' is redirected (302) to /cas/login which can be detected checking
// if the response URL has changed.

export const getMe = async ({ httpClient, apiUrls }) => {
  return retryOnRedirect({
    httpClient,
    targetUrl: apiUrls.url('kayttooikeus-service.me'),
  });
};
