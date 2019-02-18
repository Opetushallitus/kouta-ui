import React from 'react';

import Typography from '../Typography';
import { getKoutaKoulutusToteutukset } from '../../apiUtils';
import useApiAsync from '../useApiAsync';
import { getFirstLanguageValue } from '../../utils';

const getToteutukset = async ({ httpClient, apiUrls, oid }) => {
  return oid ? getKoutaKoulutusToteutukset({ httpClient, apiUrls, oid }) : [];
};

const ToteutuksetSection = ({ koulutus }) => {
  const koulutusOid = koulutus ? koulutus.oid : null;

  const { data: toteutukset } = useApiAsync({
    promiseFn: getToteutukset,
    oid: koulutusOid,
    watch: koulutusOid,
  });

  const toteutusNames = toteutukset
    ? toteutukset.map(({ nimi }) => getFirstLanguageValue(nimi)).filter(n => !!n)
    : [];

  return (
    <Typography>
      {toteutusNames.length === 0
        ? 'Tähän koulutukseen ei ole vielä liitetty toteutuksia'
        : `Tähän koulutukseen on liitetty seuraavat toteutukset: ${toteutusNames.join(
            ', ',
          )}`}
    </Typography>
  );
};

export default ToteutuksetSection;
