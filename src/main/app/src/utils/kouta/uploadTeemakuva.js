export default async function({ image, httpClient, apiUrls }) {
  const { data } = await httpClient.post(
    apiUrls.url('kouta-backend.upload-theme-image'),
    image,
    {
      headers: {
        'Content-Type': image.type,
      },
    },
  );

  return data.url;
}
