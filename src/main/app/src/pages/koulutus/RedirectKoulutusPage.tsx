import React from 'react';
import { Redirect } from 'react-router-dom';
import useApiAsync from '#/src/hooks/useApiAsync';
import { usePreferredOrganisaatio } from '#/src/hooks/useOrganisaatio';
import Spin from '@opetushallitus/virkailija-ui-components/Spin';
import Flex, { FlexItem } from '#/src/components/Flex';
import getKoulutusByOid from '#/src/utils/koulutus/getKoulutusByOid';

const Loader = () => (
  <Flex alignCenter column>
    <FlexItem marginBottom={1}>
      <Spin />
    </FlexItem>
  </Flex>
);

const Koulutus = ({ koulutus }) => {
  const { preferredOrganisaatio } = usePreferredOrganisaatio(
    koulutus.organisaatioOid
  );
  return preferredOrganisaatio ? (
    <Redirect
      to={`/organisaatio/${preferredOrganisaatio}/koulutus/${koulutus.oid}/muokkaus`}
    />
  ) : (
    <Loader />
  );
};

const getData = async ({ httpClient, apiUrls, oid: koulutusOid }) => {
  const koulutus = await getKoulutusByOid({
    httpClient,
    apiUrls,
    oid: koulutusOid,
  });
  return { koulutus };
};

const RedirectKoulutusFooter = props => {
  const {
    match: {
      params: { oid },
    },
  } = props;

  const watch = JSON.stringify([oid]);

  const { data: { koulutus } = {} } = useApiAsync({
    promiseFn: getData,
    oid,
    watch,
  });

  return koulutus ? <Koulutus koulutus={koulutus} /> : <Loader />;
};

export default RedirectKoulutusFooter;
