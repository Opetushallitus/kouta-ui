import _ from 'lodash/fp';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import { isBefore, parseISO, endOfToday } from 'date-fns';

const isValidKoulutusKoodi = ({ koodisto, tila, voimassaLoppuPvm }) =>
  koodisto?.koodistoUri === 'koulutus' &&
  tila === 'HYVAKSYTTY' &&
  (_.isNil(voimassaLoppuPvm) ||
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

    return data?.filter(isValidKoulutusKoodi);
  }
};

export const useKoulutuksetByKoulutusala = koulutusalat => {
  return useApiQuery(
    'koulutusalat',
    { koulutusalaKoodiUri: koulutusalat },
    getKoulutuksetByKoulutusala,
    {
      enabled: koulutusalat,
    }
  );
};
