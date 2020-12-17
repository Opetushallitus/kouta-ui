// Need to retry getMe a few times, because often session is not created when first called
// 'kayttooikeus-service.me' is redirected (302) to /cas/login which can be detected checking
// if the response URL has changed.

export const getMe = async ({ httpClient, apiUrls }) => {
  const fn = () =>
    httpClient.get(apiUrls.url('kayttooikeus-service.me'), {
      cache: {
        ignoreCache: true,
      },
    });
  let res = await fn();
  let count = 3;
  while (
    res?.request.responseURL !== apiUrls.url('kayttooikeus-service.me') &&
    count !== 0
  ) {
    res = await fn();
    count -= 1;
  }
  return res?.data;
};
