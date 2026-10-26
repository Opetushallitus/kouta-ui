import { useMemo } from 'react';

import { get } from 'lodash';

import { LONG_CACHE_QUERY_OPTIONS } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import getKoodisto from '#/src/utils/koodi/getKoodisto';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';

const getKoodistot = ({ versiot, httpClient, apiUrls }) => {
  return versiot.length > 0
    ? Promise.all(
        versiot.map(([koodisto, versio]) =>
          getKoodisto({
            httpClient,
            apiUrls,
            koodistoUri: koodisto,
            versio,
          }).catch(e => {
            console.warn(e);
          })
        )
      )
    : [];
};

export const useKoodit = koodiUris => {
  const versiot = useMemo(() => {
    const versiotMap = Array.isArray(koodiUris)
      ? koodiUris.reduce((acc, uri) => {
          const { koodisto, versio } = parseKoodiUri(uri);

          if (koodisto && versio) {
            acc[koodisto] = versio;
          }

          return acc;
        }, {})
      : {};

    return Object.entries(versiotMap);
  }, [koodiUris]);

  const { data, ...rest } = useApiQuery(
    'getKoodistot',
    getKoodistot,
    { versiot },
    LONG_CACHE_QUERY_OPTIONS
  );

  const koodit = useMemo(() => {
    return koodiUris.map(uri => {
      const { koodisto, versio } = parseKoodiUri(uri);

      const dataKoodisto = data
        ? data.find(
            k =>
              get(k, '[0].koodisto.koodistoUri') === koodisto &&
              `${get(k, '[0].versio')}` === versio
          )
        : undefined;

      if (!dataKoodisto) {
        return undefined;
      }

      return dataKoodisto.find(
        ({ koodiUri, versio }) => `${koodiUri}#${versio}` === uri
      );
    });
  }, [data, koodiUris]);

  return { koodit, ...rest };
};

export default useKoodit;
