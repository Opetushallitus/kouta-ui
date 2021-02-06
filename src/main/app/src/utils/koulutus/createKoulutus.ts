import produce from 'immer';
import _ from 'lodash';

import { getKoulutusByKoodi } from '#/src/utils/koulutus/getKoulutusByKoodi';

const createKoulutus = async ({
  httpClient,
  apiUrls,
  koulutus: koulutusArg,
}) => {
  let koulutus = produce(koulutusArg, draft => {
    draft.metadata.tyyppi = koulutusArg.koulutustyyppi;
  });

  if (_.isEmpty(koulutus.nimi) && koulutus.koulutusKoodiUri) {
    const { nimi } = await getKoulutusByKoodi({
      koodiUri: koulutus.koulutusKoodiUri,
      httpClient,
      apiUrls,
    });

    koulutus = { ...koulutus, nimi };
  }

  const { data } = await httpClient.put(
    apiUrls.url('kouta-backend.koulutus'),
    koulutus
  );

  return data;
};

export default createKoulutus;
