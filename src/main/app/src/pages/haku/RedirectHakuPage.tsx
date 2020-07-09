import React from 'react';
import { Redirect } from 'react-router-dom';
import useApiAsync from '#/src/hooks/useApiAsync';
import { usePreferredOrganisaatio } from '#/src/hooks/useOrganisaatio';
import Spin from '@opetushallitus/virkailija-ui-components/Spin';
import Flex, { FlexItem } from '#/src/components/Flex';
import getHakuByOid from '#/src/utils/haku/getHakuByOid';

const Loader = () => (
  <Flex alignCenter column>
    <FlexItem marginBottom={1}>
      <Spin />
    </FlexItem>
  </Flex>
);

const Haku = ({ haku }) => {
  const { preferredOrganisaatio } = usePreferredOrganisaatio(
    haku.organisaatioOid
  );
  return preferredOrganisaatio ? (
    <Redirect
      to={`/organisaatio/${preferredOrganisaatio}/haku/${haku.oid}/muokkaus`}
    />
  ) : (
    <Loader />
  );
};

const getData = async ({ httpClient, apiUrls, oid: hakuOid }) => {
  const haku = await getHakuByOid({
    httpClient,
    apiUrls,
    oid: hakuOid,
  });
  return { haku };
};

const RedirectHakuFooter = props => {
  const {
    match: {
      params: { oid },
    },
  } = props;

  const watch = JSON.stringify([oid]);

  const { data: { haku } = {} } = useApiAsync({
    promiseFn: getData,
    oid,
    watch,
  });

  return haku ? <Haku haku={haku} /> : <Loader />;
};

export default RedirectHakuFooter;
