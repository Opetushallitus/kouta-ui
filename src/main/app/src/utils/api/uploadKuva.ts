export const uploadTeemakuva = async function ({
  image,
  httpClient,
  apiUrls,
  params,
}) {
  const { data } = await httpClient.post(
    apiUrls.url('kouta-backend.upload-teemakuva'),
    image,
    {
      headers: {
        'Content-Type': image.type,
      },
      params,
    }
  );

  return data.url;
};

export const uploadIcon = async function ({ image, httpClient, apiUrls }) {
  const { data } = await httpClient.post(
    apiUrls.url('kouta-backend.upload-icon'),
    image,
    {
      headers: {
        'Content-Type': image.type,
      },
    }
  );

  return data.url;
};
