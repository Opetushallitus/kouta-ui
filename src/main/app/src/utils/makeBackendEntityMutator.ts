export const makeBackendEntityMutator =
  (method: 'put' | 'post', dataProp: string, urlKey: string) => async props => {
    // "modified" on backendin generoima ja "lastModified" tulee "x-last-modified"-headerissa (muokkaus)
    // Ei lähetetä näitä kenttiä datan mukana tallennettaessa
    const { modified, lastModified, ...entityData } = props[dataProp];
    const { data } = await props.httpClient[method](
      props.apiUrls.url(urlKey),
      entityData,
      {
        errorNotifier: {
          silent: true,
        },
        ...(method === 'post'
          ? {
              headers: {
                'X-If-Unmodified-Since': lastModified,
              },
            }
          : {}),
      }
    );
    return data;
  };
