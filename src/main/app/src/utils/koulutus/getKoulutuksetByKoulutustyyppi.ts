import { isBefore, parseISO, endOfToday } from 'date-fns';
import _fp from 'lodash/fp';

import { KOULUTUSTYYPPI_TO_YLAKOODIURI_MAP } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';

const isValidKoulutusKoodi = ({ koodisto, voimassaLoppuPvm }) =>
  koodisto?.koodistoUri === 'koulutus' &&
  (_fp.isNil(voimassaLoppuPvm) ||
    isBefore(endOfToday(), parseISO(voimassaLoppuPvm)));

export const getKoulutuksetByKoulutusTyyppi = async ({
  httpClient,
  apiUrls,
  koulutustyyppi,
}) => {
  const ids = KOULUTUSTYYPPI_TO_YLAKOODIURI_MAP[koulutustyyppi];

  let responses: any = [];

  if (!ids) {
    responses = [
      await httpClient.get(apiUrls.url('koodisto-service.koodi', 'koulutus')),
    ];
  } else {
    responses = await Promise.all(
      ids.map(id =>
        httpClient.get(apiUrls.url('koodisto-service.sisaltyy-ylakoodit', id))
      )
    );
  }

  const koulutukset = _fp.flatMap((response: any) => {
    const { data } = response;
    return _fp.isArray(data) ? data : [];
  }, responses);

  return _fp.flow(
    _fp.filter(isValidKoulutusKoodi),
    _fp.groupBy('koodiUri'),
    _fp.map(_fp.maxBy('versio'))
  )(koulutukset);
};

export const useKoulutuksetByKoulutustyyppi = koulutustyyppi => {
  return useApiQuery(
    'getKoulutuksetByKoulutustyyppi',
    getKoulutuksetByKoulutusTyyppi,
    { koulutustyyppi },
    {
      enabled: Boolean(koulutustyyppi),
      refetchOnWindowFocus: false,
    }
  );
};
