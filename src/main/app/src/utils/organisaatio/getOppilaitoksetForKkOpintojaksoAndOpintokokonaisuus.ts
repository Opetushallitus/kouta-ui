import _ from 'lodash';

const getOppilaitosOrgsForKkOpintojaksoAndOpintokokonaisuus = async ({
  apiUrls,
  httpClient,
}) => {
  const { data } = await httpClient.get(
    apiUrls.url(
      'kouta-backend.oppilaitos-organisaatiot-for-opintojakso-and-opintokokonaisuus'
    )
  );

  return _.get(data, 'organisaatiot') || [];
};

export default getOppilaitosOrgsForKkOpintojaksoAndOpintokokonaisuus;
