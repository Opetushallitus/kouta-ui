import React from 'react';

import Typography from '../Typography';
import { getKoutaToteutusHakukohteet } from '../../apiUtils';
import useApiAsync from '../useApiAsync';
import { getFirstLanguageValue } from '../../utils';

const getHakukohteet = async ({ httpClient, apiUrls, oid }) => {
  return oid ? getKoutaToteutusHakukohteet({ httpClient, apiUrls, oid }) : [];
};

const HakukohteetSection = ({ toteutus }) => {
  const toteutusOid = toteutus ? toteutus.oid : null;

  const { data: hakukohteet } = useApiAsync({
    promiseFn: getHakukohteet,
    oid: toteutusOid,
    watch: toteutusOid,
  });

  const hakukohdeNames = hakukohteet
    ? hakukohteet.map(({ nimi }) => getFirstLanguageValue(nimi)).filter(n => !!n)
    : [];

  return (
    <Typography>
      {hakukohdeNames.length === 0
        ? 'Tähän toteutukseen ei ole vielä liitetty hakukohteita'
        : `Tähän toteutukseen on liitetty seuraavat hakukohteet: ${hakukohdeNames.join(
            ', ',
          )}`}
    </Typography>
  );
};

export default HakukohteetSection;
