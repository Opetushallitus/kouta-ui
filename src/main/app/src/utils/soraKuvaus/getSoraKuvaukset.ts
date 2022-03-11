import { useApiQuery } from '#/src/hooks/useApiQuery';

const getSoraKuvaukset = async ({ httpClient, apiUrls, organisaatioOid }) => {
  const { data } = await httpClient.get(
    apiUrls.url('kouta-backend.soraKuvaus-list'),
    { params: { organisaatioOid, myosArkistoidut: true } }
  );

  return data;
};

export const useSoraKuvaukset = ({ organisaatioOid }) => {
  const { data: soraKuvaukset, ...rest } = useApiQuery(
    'getSoraKuvaukset',
    getSoraKuvaukset,
    {
      promiseFn: getSoraKuvaukset,
      organisaatioOid,
    },
    { enabled: Boolean(organisaatioOid) }
  );

  return { soraKuvaukset, ...rest };
};

export default getSoraKuvaukset;
