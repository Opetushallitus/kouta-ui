import { useMemo } from 'react';

import _ from 'lodash';

import { sanitizeHTML } from '#/src/utils';
import { useEPerusteById } from '#/src/utils/ePeruste/getEPerusteById';
import { useEPerusteOsaamisalaKuvaukset } from '#/src/utils/ePeruste/getOsaamisalakuvauksetByEPerusteId';

const useExtendedEPeruste = ePerusteId => {
  const { data: ePeruste, isLoading: ePerusteLoading } =
    useEPerusteById(ePerusteId);
  const { data: osaamisalaKuvaukset, isLoading: osaamisalaKuvauksetLoading } =
    useEPerusteOsaamisalaKuvaukset({ ePerusteId });

  const osaamisalat = ePeruste?.osaamisalat;

  const osaamisalatWithDescriptions = useMemo(
    () =>
      _.map(osaamisalat, osaamisala => ({
        ...osaamisala,
        kuvaus: _.mapValues(
          _.get(osaamisalaKuvaukset, [osaamisala.uri, 0, 'teksti']) || {},
          v => (_.isString(v) ? sanitizeHTML(v) : v)
        ),
      })),
    [osaamisalat, osaamisalaKuvaukset]
  );

  return {
    data: ePeruste
      ? { ...ePeruste, osaamisalat: osaamisalatWithDescriptions }
      : null,
    isLoading: ePerusteLoading || osaamisalaKuvauksetLoading,
  };
};

export default useExtendedEPeruste;
