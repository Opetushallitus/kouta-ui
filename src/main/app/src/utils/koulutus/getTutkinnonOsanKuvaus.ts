import _ from 'lodash';

export const getTutkinnonOsanKuvaus = async ({
  httpClient,
  apiUrls,
  tutkinnonOsat,
}) => {
  if (_.isNil(tutkinnonOsat)) {
    return null;
  }

  const kuvaukset = await Promise.all(
    tutkinnonOsat.map(id =>
      httpClient
        .get(apiUrls.url('eperusteet-service.tutkinnonosankuvaukset', id))
        .then(({ data }) => data)
    )
  );
  return kuvaukset;
};
