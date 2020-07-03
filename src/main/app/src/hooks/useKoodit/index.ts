import { useMemo } from 'react';
import { get, isArray } from 'lodash';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';
import getKoodisto from '#/src/utils/koodi/getKoodisto';
import useApiAsync from '#/src/hooks/useApiAsync';

const noopPromiseFn = () => Promise.resolve([]);

const useKoodit = koodiUris => {
  const versiot = useMemo(() => {
    const versiotMap = isArray(koodiUris)
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

  const promiseFn = useMemo(() => {
    return versiot.length > 0
      ? args =>
          Promise.all(
            versiot.map(([koodisto, versio]) =>
              getKoodisto({
                ...args,
                koodistoUri: koodisto,
                versio,
              }).catch(() => undefined)
            )
          )
      : noopPromiseFn;
  }, [versiot]);

  const { data, ...rest } = useApiAsync({
    promiseFn,
  });

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
