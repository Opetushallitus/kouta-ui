import { isBefore, parseISO, endOfToday } from 'date-fns';
import _fp from 'lodash/fp';

import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';

const isValidKoulutusKoodi = ({ koodisto, voimassaLoppuPvm }) =>
  koodisto?.koodistoUri === 'koulutus' &&
  (_fp.isNil(voimassaLoppuPvm) ||
    isBefore(endOfToday(), parseISO(voimassaLoppuPvm)));

const getKoulutuksetByKoulutusala = async ({
  httpClient,
  apiUrls,
  koulutusalaKoodiUri,
}) => {
  if (koulutusalaKoodiUri) {
    const { data } = await httpClient.get(
      apiUrls.url('koodisto-service.sisaltyy-ylakoodit', '') +
        koulutusalaKoodiUri
    );

    return _fp.flow(
      _fp.filter(isValidKoulutusKoodi),
      _fp.groupBy('koodiUri'),
      _fp.map(_fp.maxBy('versio'))
    )(data);
  }
};

export const useKoulutuksetByKoulutusala = koulutusalat => {
  return useApiQuery(
    'getKoulutuksetByKoulutusala',
    getKoulutuksetByKoulutusala,
    { koulutusalaKoodiUri: koulutusalat },
    {
      enabled: Boolean(koulutusalat),
      ...LONG_CACHE_QUERY_OPTIONS,
    }
  );
};
