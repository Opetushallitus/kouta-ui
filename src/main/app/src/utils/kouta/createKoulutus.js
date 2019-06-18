import { getKoulutusByKoodi } from '../../apiUtils';
import isEmpty from '../isEmpty';

const createKoulutus = async ({
  httpClient,
  apiUrls,
  koulutus: koulutusArg,
}) => {
  let koulutus = koulutusArg;

  if (isEmpty(koulutus.nimi) && koulutus.koulutusKoodiUri) {
    const { nimi } = await getKoulutusByKoodi({
      koodiUri: koulutus.koulutusKoodiUri,
      httpClient,
      apiUrls,
    });

    koulutus = { ...koulutus, nimi };
  }

  const { data } = await httpClient.put(
    apiUrls.url('kouta-backend.koulutus'),
    koulutus,
  );

  return data;
};

export default createKoulutus;
