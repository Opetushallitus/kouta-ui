import _ from 'lodash';
import { KOULUTUSTYYPPI_TO_KOULUTUSTYYPPI_IDS_MAP } from '#/src/constants';

export const getKoulutuksetByKoulutusTyyppi = async ({
  httpClient,
  apiUrls,
  koulutusTyyppi,
}) => {
  const ids = KOULUTUSTYYPPI_TO_KOULUTUSTYYPPI_IDS_MAP[koulutusTyyppi];

  if (!ids) {
    return [];
  }

  const responses = await Promise.all(
    ids.map(id =>
      httpClient.get(apiUrls.url('koodisto-service.sisaltyy-ylakoodit', id))
    )
  );

  const koulutukset = responses.reduce((acc, response) => {
    const { data } = response;

    if (!_.isArray(data)) {
      return acc;
    }

    return [
      ...acc,
      ...data.map(({ metadata, koodisto, koodiArvo, koodiUri, versio }) => ({
        metadata,
        koodisto,
        koodiArvo,
        koodiUri,
        versio,
      })),
    ];
  }, []);

  const latestKoulutukset = _.toPairs(
    _.groupBy(koulutukset, ({ koodiUri }) => koodiUri)
  ).map(([, versiot]) => _.maxBy(versiot, ({ versio }) => versio));

  return latestKoulutukset.filter(({ koodiUri }) =>
    /^koulutus_/.test(koodiUri)
  );
};
